import { Client, isFullBlock, isFullPage } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
interface Env {
  KV: KVNamespace;
  NOTION_TOKEN?: string;
  CF_PAGES_URL: string;
}

function getFileUrl(block: BlockObjectResponse): string | null {
  return block[block.type].file?.url;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  await context.env.KV.put("test", "test");
  const test = await context.env.KV.get("test");
  return new Response(test, { status: 200 });
  const url = new URL(context.request.url);

  const blockId = url.searchParams.get("block_id");
  const pageId = url.searchParams.get("page_id");
  if (!blockId && !pageId) {
    return new Response("block_id or page_id is required", { status: 400 });
  }

  const NOTION_TOKEN = context.env.NOTION_TOKEN;
  if (!NOTION_TOKEN) {
    return new Response("NOTION_TOKEN is not set as an environment variable", {
      status: 400,
    });
  }

  const notion = new Client({ auth: context.env.NOTION_TOKEN });

  if (blockId) {
    const block = await notion.blocks.retrieve({ block_id: blockId });

    if (!isFullBlock(block)) {
      return new Response("Failed to retreve block", { status: 400 });
    }

    const fileUrl = getFileUrl(block);
    if (!fileUrl) {
      return new Response("No file url found", {
        status: 400,
      });
    }

    return Response.redirect(fileUrl, 302);
  } else {
    const page = await notion.pages.retrieve({ page_id: pageId });

    if (!isFullPage(page)) {
      return new Response("Failed to retrieve page", { status: 400 });
    }
    
    if (!page.cover) {
      return new Response("No cover found", { status: 400 });
    }
    
    const fileUrl =
      page.cover.type === "external"
        ? page.cover.external.url
        : page.cover.file.url;
    
        return Response.redirect(fileUrl, 302);
  }
};

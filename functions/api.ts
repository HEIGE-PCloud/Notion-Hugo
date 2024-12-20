import { Client, isFullBlock } from "@notionhq/client";
interface Env {
  KV: KVNamespace;
  NOTION_TOKEN?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  const blockId = url.searchParams.get("block_id");
  if (!blockId) {
    return new Response("block_id is required", { status: 400 });
  }

  const NOTION_TOKEN = context.env.NOTION_TOKEN;
  if (!NOTION_TOKEN) {
    return new Response("NOTION_TOKEN is not set as an environment variable", {
      status: 400,
    });
  }

  const notion = new Client({ auth: context.env.NOTION_TOKEN });

  const block = await notion.blocks.retrieve({ block_id: blockId });

  if (!isFullBlock(block)) {
    return new Response("Failed to retreve block", { status: 400 });
  }

  if (block.type !== "image") {
    return new Response("Only image blocks are supported", { status: 400 });
  }

  const image_url =
    block.image.type === "external"
      ? block.image.external.url
      : block.image.file.url;

  return Response.redirect(image_url, 302);
};

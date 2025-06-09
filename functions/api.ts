import { Client, isFullBlock, isFullPage } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
interface Env {
  KV: KVNamespace;
  NOTION_TOKEN?: string;
  CF_PAGES_URL: string;
}

type CacheEntry = {
  url: string; // An authenticated S3 URL to the file. The URL is valid for one hour. If the link expires, then you can send an API request to get an updated URL.
  expiry_time: string; // The date and time when the link expires, formatted as an ISO 8601 date time string.
};

function getFile(
  block: BlockObjectResponse,
): { url: string; expiry_time: string } | null {
  return block[block.type].file;
}

async function getCachedData(
  cache: KVNamespace,
  key: string,
): Promise<CacheEntry | null> {
  const cache_entry = await cache.get<CacheEntry>(key, { type: "json" });
  if (cache_entry === null) {
    return null;
  }
  const expiry_time = new Date(cache_entry.expiry_time);
  if (expiry_time < new Date()) {
    return null;
  }
  return cache_entry;
}

async function setCachedData(
  cache: KVNamespace,
  key: string,
  data: CacheEntry,
): Promise<void> {
  await cache.put(key, JSON.stringify(data), { expirationTtl: 3600 });
}

export const onRequest: PagesFunction<Env> = async (context) => {
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

  const notion = new Client({ auth: context.env.NOTION_TOKEN, fetch: fetch.bind(globalThis) });

  const cacheData = await getCachedData(context.env.KV, pageId ?? blockId);
  if (cacheData) {
    return Response.redirect(cacheData.url, 302);
  }

  if (blockId) {
    const block = await notion.blocks.retrieve({ block_id: blockId });

    if (!isFullBlock(block)) {
      return new Response("Failed to retreve block", { status: 400 });
    }

    const file = getFile(block);
    if (!file) {
      return new Response("No file url found", {
        status: 400,
      });
    }

    await setCachedData(context.env.KV, blockId, file);
    return Response.redirect(file.url, 302);
  } else {
    const page = await notion.pages.retrieve({ page_id: pageId });

    if (!isFullPage(page)) {
      return new Response("Failed to retrieve page", { status: 400 });
    }

    if (!page.cover) {
      return new Response("No cover found", { status: 400 });
    }

    if (page.cover.type === "external") {
      return new Response("External cover is not supported", { status: 400 });
    }

    await setCachedData(context.env.KV, pageId, page.cover.file);
    return Response.redirect(page.cover.file.url, 302);
  }
};

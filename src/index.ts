import { Client, isFullPage, iteratePaginatedAPI } from "@notionhq/client";
import dotenv from "dotenv";
import fs from "fs-extra";
import { loadConfig, renderPage, savePage, sh } from "./helpers";

dotenv.config();

async function main() {
  const config = loadConfig();

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  // process mounted databases
  for (const mount of config.mount.databases) {
    fs.emptyDirSync(`content/${mount.target_folder}`);
    for await (const page of iteratePaginatedAPI(notion.databases.query, {
      database_id: mount.database_id,
    })) {
      await savePage(page, notion, mount);
    }
  }

  // process mounted pages
  for (const mount of config.mount.pages) {
    const page = await notion.pages.retrieve({ page_id: mount.page_id });
    await savePage(page, notion, mount);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

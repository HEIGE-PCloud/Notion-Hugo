import { Client, isFullPage, iteratePaginatedAPI } from "@notionhq/client";
import dotenv from "dotenv";
import fs from "fs-extra";
import { savePage } from "./render";
import { loadConfig } from "./config";
import { getAllContentFiles } from "./file";
import { isFullPageOrDatabase } from "@notionhq/client/build/src/helpers";
import { getFileName, getPageTitle } from "./helpers";

dotenv.config();

async function main() {
  if (process.env.NOTION_TOKEN === "")
    throw Error("The NOTION_TOKEN environment vairable is not set.");
  const config = await loadConfig();
  console.info("[Info] Config loaded ");

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const pages: string[] = [];

  console.info("[Info] Start processing mounted databases");
  // process mounted databases
  for (const mount of config.mount.databases) {
    fs.ensureDirSync(`content/${mount.target_folder}`);
    for await (const page of iteratePaginatedAPI(notion.databases.query, {
      database_id: mount.database_id,
    })) {
      if (!isFullPageOrDatabase(page) || page.object !== "page") {
        continue;
      }
      console.info(`[Info] Start processing page ${page.id}`);
      pages.push(getFileName(getPageTitle(page), page.id));
      await savePage(page, notion, mount);
    }
  }

  // process mounted pages
  for (const mount of config.mount.pages) {
    const page = await notion.pages.retrieve({ page_id: mount.page_id });
    if (!isFullPage(page)) {
      continue;
    }
    pages.push(getFileName(getPageTitle(page), page.id));
    await savePage(page, notion, mount);
  }

  // remove posts that exist locally but not in Notion Database
  const contentFiles = getAllContentFiles("content");
  for (const file of contentFiles) {
    if (!pages.includes(file.filename) && file.managed) {
      console.info(`[Info] Removing unsynced file ${file.filepath}`);
      fs.removeSync(file.filepath);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

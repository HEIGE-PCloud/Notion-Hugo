import { Client, isFullPage, iteratePaginatedAPI } from "@notionhq/client";
import dotenv from "dotenv";
import fs from "fs-extra";
import { savePage } from "./render";
import { loadConfig } from "./config";
import { getAllContentFiles, getContentFile } from "./file";
import path from "path";
import { getFileName, getPageTitle } from "./helpers";

dotenv.config();

async function main() {
  if (process.env.NOTION_TOKEN === "")
    throw Error("The NOTION_TOKEN environment vairable is not set.");

  const config = loadConfig();

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const page_ids: string[] = []

  // process mounted databases
  for (const mount of config.mount.databases) {
    fs.ensureDirSync(`content/${mount.target_folder}`);
    for await (const page of iteratePaginatedAPI(notion.databases.query, {
      database_id: mount.database_id,
    })) {
      if (!isFullPage(page)) continue;
      page_ids.push(page.id)
      const postpath = path.join(
        "content",
        mount.target_folder,
        getFileName(getPageTitle(page), page.id)
      );
      const post = getContentFile(postpath);
      if (post) {
        const metadata = post?.metadata;
        // if the page does not contain any resources which expires
        // and if the page is not modified, continue
        if (post.expiry_time == null && metadata.last_edited_time === page.last_edited_time) {
          console.info(`[Info] The post ${postpath} is up-to-date, skipped.`);
          continue;
        }
      }

      console.info(`Updating ${postpath}`);
      await savePage(page, notion, mount);
    }
  }

  // process mounted pages
  for (const mount of config.mount.pages) {
    const page = await notion.pages.retrieve({ page_id: mount.page_id });
    if (!isFullPage(page)) continue;
    page_ids.push(page.id)
    const postpath = path.join(
      "content",
      mount.target_folder,
      getFileName(getPageTitle(page), page.id)
    );
    const post = getContentFile(postpath);
    if (post) {
      const metadata = post?.metadata;
      // if the page is not modified, continue
      if (post.expiry_time == null && metadata.last_edited_time === page.last_edited_time) {
        console.info(`[Info] The post ${postpath} is up-to-date, skipped.`);
        continue;
      }
    }
    // otherwise update the page
    console.info(`Updating ${postpath}`);
    await savePage(page, notion, mount);
  }

  // remove posts that exist locally but not in Notion Database
  const contentFiles = getAllContentFiles('content')
  for (const file of contentFiles) {
    if (!page_ids.includes(file.metadata.id)) {
      fs.removeSync(file.filepath)
    }
  }
  
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

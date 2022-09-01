import { Client, isFullPage, iteratePaginatedAPI } from "@notionhq/client";
import { PropertyItemListResponse, TitlePropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import dotenv from "dotenv";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs-extra";
import { getCoverLink, getPageTitle, loadConfig, sh } from "./helpers";
import YAML from 'yaml'

dotenv.config();


async function main() {
  const config = loadConfig()

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const n2m = new NotionToMarkdown({ notionClient: notion });

  for (const mount of config.mounts) {
    for await (const page of iteratePaginatedAPI(notion.databases.query, {
      database_id: mount.database_id
    })) {
      if (!isFullPage(page)) continue
      const mdblocks = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(mdblocks);
      const title = await getPageTitle(page.id, notion)
      const featuredImageLink = await getCoverLink(page.id, notion);
      const frontMatter = `---
${YAML.stringify({
  title,
  date: page.created_time,
  draft: false,
  featuredImage: featuredImageLink ?? undefined  
})}
---
`
      // clean the target folder
      fs.emptyDirSync(`content/${mount.target_folder}`)
      const fileName = title.replaceAll(' ', '-').toLowerCase()
      let { stdout } = await sh(`hugo new ${mount.target_folder}/${fileName}.md`);
      console.log(stdout)
      fs.writeFileSync(`content/${mount.target_folder}/${fileName}.md`, frontMatter + mdString);
    
    }
      
  }

  
}



main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

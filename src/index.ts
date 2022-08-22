import { Client, isFullPage, iteratePaginatedAPI } from "@notionhq/client";
import { PropertyItemListResponse, TitlePropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import dotenv from "dotenv";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
dotenv.config();


async function main() {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const n2m = new NotionToMarkdown({ notionClient: notion });


  const DATABASE_ID = process.env.DATABASE_ID
  if (DATABASE_ID === undefined) {
    throw "DATABASE_ID has not been set"    
  }
  

  for await (const page of iteratePaginatedAPI(notion.databases.query, {
    database_id: DATABASE_ID
  })) {
    if (!isFullPage(page)) continue
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);
    const response = (await notion.pages.properties.retrieve({ page_id: page.id, property_id: 'title' })) as PropertyItemListResponse
    const titleResponse = response.results[0] as TitlePropertyItemObjectResponse
    const title = titleResponse.title.plain_text
    const fileName = `${title}.md` 
    console.log(mdString)
    fs.writeFileSync(fileName, mdString);
  
  }
  
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

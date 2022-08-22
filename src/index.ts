import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { exit } from "process";

dotenv.config();

async function main() {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const DATABASE_ID = process.env.DATABASE_ID
  if (DATABASE_ID === undefined) {
    console.error("DATABASE_ID has not been set")
    exit(1)
  }
  
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
  });

  console.log("Got response:", response);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

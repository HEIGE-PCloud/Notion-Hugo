import { Client, isFullBlock, iteratePaginatedAPI } from "@notionhq/client";

import userDefinedConfig from "../notion-hugo.config";

export type PageMount = {
  page_id: string;
  target_folder: string;
};

export type DatabaseMount = {
  database_id: string;
  target_folder: string;
};

export type Mount = {
  databases: DatabaseMount[];
  pages: PageMount[];
};

export type Config = {
  mount: Mount;
};

export async function loadConfig(): Promise<Config> {
  const userConfig = userDefinedConfig as UserConfig;
  const config: Config = {
    mount: {
      databases: [],
      pages: [],
    },
  };
  // configure mount settings
  if (userConfig.mount.manual) {
    if (userConfig.mount.databases)
      config.mount.databases = userConfig.mount.databases;
    if (userConfig.mount.pages) config.mount.pages = userConfig.mount.pages;
  } else {
    if (userConfig.mount.page_url === undefined)
      throw Error(
        `[Error] When mount.manual is false, a page_url must be set.`,
      );
    const url = new URL(userConfig.mount.page_url);
    const len = url.pathname.length;
    if (len < 32) throw Error(`[Error] The page_url ${url.href} is invalid`);
    const pageId = url.pathname.slice(len - 32, len);
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });

    for await (const block of iteratePaginatedAPI(notion.blocks.children.list, {
      block_id: pageId,
    })) {
      if (!isFullBlock(block)) continue;
      if (block.type === "child_database") {
        config.mount.databases.push({
          database_id: block.id,
          target_folder: block.child_database.title,
        });
      }
      if (block.type === "child_page") {
        config.mount.pages.push({
          page_id: block.id,
          target_folder: ".",
        });
      }
    }
  }

  return config;
}

export type UserMount = {
  manual: boolean;
  page_url?: string;
  databases?: DatabaseMount[];
  pages?: PageMount[];
};

export type UserConfig = {
  mount: UserMount;
};

export function defineConfig(config: UserConfig) {
  return config;
}

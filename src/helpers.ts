import { exec } from "child_process";
import toml from "toml";
import fs from "fs-extra";
import { Client, isFullPage } from "@notionhq/client";
import {
  GetPageResponse,
  PageObjectResponse,
  PropertyItemListResponse,
  TitlePropertyItemObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";
import YAML from "yaml";

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
export async function sh(
  cmd: string,
  panic: boolean = true
): Promise<{ stdout: string; stderr: string }> {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err && panic) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

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
}

export type Config = {
  mount: Mount
};

export function loadConfig(): Config {
  const configString = fs.readFileSync("config/notion.toml", "utf8");
  const config = toml.parse(configString) as Config;

  if (config.mount === undefined || config.mount === null) {
    throw new SyntaxError("Error: No mount is configured in notion.toml.");
  }

  return config;
}

export async function getPageTitle(
  page_id: string,
  notion: Client
): Promise<string> {
  const response = (await notion.pages.properties.retrieve({
    page_id,
    property_id: "title",
  })) as PropertyItemListResponse;
  const titleResponse = response.results[0] as TitlePropertyItemObjectResponse;
  const title = titleResponse.title.plain_text;
  return title;
}

export async function getCoverLink(
  page_id: string,
  notion: Client
): Promise<string | null> {
  const page = await notion.pages.retrieve({ page_id });
  if (!isFullPage(page)) return null;
  if (page.cover === null) return null;
  if (page.cover.type === "external") return page.cover.external.url;
  else return page.cover.file.url;
}

export async function renderPage(
  page: PageObjectResponse,
  notion: Client
) {
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const mdblocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdblocks);
  const title = await getPageTitle(page.id, notion);
  const featuredImageLink = await getCoverLink(page.id, notion);
  const frontMatter = {
    title,
    date: page.created_time,
    draft: false,
    featuredImage: featuredImageLink ?? undefined,
  };
  return {
    title,
    pageString: '---\n' + YAML.stringify(frontMatter) + '\n---\n' + mdString
  }
}

export async function savePage(page: GetPageResponse, notion: Client, mount: DatabaseMount | PageMount) {
  if (!isFullPage(page)) return;
  const { title, pageString } = await renderPage(page, notion);
  const fileName = title.replaceAll(' ', '-').replace(/--+/g, '-') + '-' + page.id.replaceAll('-', '')
  let { stdout } = await sh(
    `hugo new "${mount.target_folder}/${fileName}.md"`,
    false
  );
  console.log(stdout);
  fs.writeFileSync(
    `content/${mount.target_folder}/${fileName}.md`,
    pageString
  );

}
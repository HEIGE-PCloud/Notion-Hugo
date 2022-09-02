import { exec } from "child_process";
import toml from "toml";
import fs from "fs-extra";
import {
  EquationBlockObjectResponse,
  Client,
  isFullPage,
  isFullUser,
  iteratePaginatedAPI,
} from "@notionhq/client";
import {
  GetPagePropertyParameters,
  GetPageResponse,
  PageObjectResponse,
  PeoplePropertyItemObjectResponse,
  PropertyItemListResponse,
  PropertyItemObjectResponse,
  PropertyItemPropertyItemListResponse,
  TitlePropertyItemObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";
import YAML from "yaml";
import katex from "katex";
require("katex/contrib/mhchem");
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
};

export type Config = {
  mount: Mount;
};

export function loadConfig(): Config {
  const configString = fs.readFileSync("config/notion.toml", "utf8");
  const config = toml.parse(configString) as Config;

  if (config.mount == null) {
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

export async function renderPage(page: PageObjectResponse, notion: Client) {
  const n2m = new NotionToMarkdown({ notionClient: notion });
  n2m.setCustomTransformer("equation", async (block) => {
    const { equation } = block as EquationBlockObjectResponse;
    const html = katex.renderToString(equation.expression, {
      throwOnError: false,
      displayMode: true,
    });
    return html;
  });

  const mdblocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdblocks);
  const title = await getPageTitle(page.id, notion);
  const featuredImageLink = await getCoverLink(page.id, notion);
  const frontMatter: Record<string, string | string[] | number | boolean> = {
    title,
    date: page.created_time,
    lastmod: page.last_edited_time,
    draft: false,
  };

  // set featuredImage
  if (featuredImageLink) frontMatter.featuredImage = featuredImageLink;

  // map page properties to front matter
  for (const property in page.properties) {
    const id = page.properties[property].id;
    const response = await notion.pages.properties.retrieve({
      page_id: page.id,
      property_id: id,
    });
    if (response.object === "property_item") {
      switch (response.type) {
        case "checkbox":
          frontMatter[property] = response.checkbox;
          break;
        case "select":
          if (response.select?.name)
            frontMatter[property] = response.select?.name;
          break;
        case "multi_select":
          frontMatter[property] = response.multi_select.map(
            (select) => select.name
          );
          break;
        case "email":
          if (response.email) frontMatter[property] = response.email;
          break;
        case "url":
          if (response.url) frontMatter[property] = response.url;
          break;
        case "date":
          if (response.date?.start)
            frontMatter[property] = response.date?.start;
          break;
        case "number":
          if (response.number) frontMatter[property] = response.number;
          break;
        case "phone_number":
          if (response.phone_number)
            frontMatter[property] = response.phone_number;
          break;
        case "status":
          if (response.status?.name)
            frontMatter[property] = response.status?.name;
        // ignore these properties
        case "last_edited_by":
        case "last_edited_time":
        case "rollup":
        case "files":
        case "formula":
        case "created_by":
        case "created_time":
          break;
        default:
          break;
      }
    } else {
      for await (const result of iteratePaginatedAPI(
        // @ts-ignore
        notion.pages.properties.retrieve,
        {
          page_id: page.id,
          property_id: id,
        }
      )) {
        switch (result.type) {
          case "people":
            frontMatter[property] = frontMatter[property] || [];
            if (isFullUser(result.people)) {
              const fm = frontMatter[property];
              if (Array.isArray(fm) && result.people.name) {
                fm.push(result.people.name);
              }
            }
            break;
          case "rich_text":
            frontMatter[property] = frontMatter[property] || "";
            frontMatter[property] += result.rich_text.plain_text;
          // ignore these
          case "relation":
          case "title":
          default:
            break;
        }
      }
    }
  }

  // set default author
  if (frontMatter.authors === undefined) {
    const response = await notion.users.retrieve({
      user_id: page.last_edited_by.id,
    });
    if (response.name) {
      frontMatter.authors = [response.name];
    }
  }

  return {
    title,
    pageString: "---\n" + YAML.stringify(frontMatter) + "\n---\n" + mdString,
  };
}

export async function savePage(
  page: GetPageResponse,
  notion: Client,
  mount: DatabaseMount | PageMount
) {
  if (!isFullPage(page)) return;
  const { title, pageString } = await renderPage(page, notion);
  const fileName =
    title.replaceAll(" ", "-").replace(/--+/g, "-") +
    "-" +
    page.id.replaceAll("-", "");
  let { stdout } = await sh(
    `hugo new "${mount.target_folder}/${fileName}.md"`,
    false
  );
  console.log(stdout);
  fs.writeFileSync(`content/${mount.target_folder}/${fileName}.md`, pageString);
}

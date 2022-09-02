import fs from "fs-extra";
import {
  Client,
  isFullPage,
  isFullUser,
  iteratePaginatedAPI,
} from "@notionhq/client";
import {
  EquationBlockObjectResponse,
  GetPageResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";
import YAML from "yaml";
import { sh } from "./sh";
import { DatabaseMount, PageMount } from "./config";
import { getPageTitle, getCoverLink } from "./helpers";
import katex from "katex";
require("katex/contrib/mhchem"); // modify katex module

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
  if (frontMatter.authors == null) {
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

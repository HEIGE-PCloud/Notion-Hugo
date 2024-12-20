import fs from "fs-extra";
import { Client, isFullUser, iteratePaginatedAPI } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "./markdown/notion-to-md";
import YAML from "yaml";
import { sh } from "./sh";
import { DatabaseMount, PageMount } from "./config";
import { getPageTitle, getCoverLink, getFileName } from "./helpers";
import path from "path";
import { getContentFile } from "./file";

export async function renderPage(page: PageObjectResponse, notion: Client) {
  // load formatter config
  const n2m = new NotionToMarkdown({ notionClient: notion });
  n2m.setUnsupportedTransformer((type) => {
    return `{{< notion-unsupported-block type=${type} >}}`;
  });
  let frontInjectString = "";
  const mdblocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdblocks);
  page.properties.Name;
  const title = getPageTitle(page);
  const frontMatter: Record<
    string,
    string | string[] | number | boolean | PageObjectResponse
  > = {
    title,
    date: page.created_time,
    lastmod: page.last_edited_time,
    draft: false,
  };

  // set featuredImage
  const featuredImageLink = await getCoverLink(page.id, notion);
  if (featuredImageLink) {
    frontMatter.featuredImage = featuredImageLink;
  }

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
          if (response.select) frontMatter[property] = response.select.name;
          break;
        case "multi_select":
          frontMatter[property] = response.multi_select.map(
            (select) => select.name,
          );
          break;
        case "email":
          if (response.email) frontMatter[property] = response.email;
          break;
        case "url":
          if (response.url) frontMatter[property] = response.url;
          break;
        case "date":
          if (response.date) frontMatter[property] = response.date.start;
          break;
        case "number":
          if (response.number) frontMatter[property] = response.number;
          break;
        case "phone_number":
          if (response.phone_number)
            frontMatter[property] = response.phone_number;
          break;
        case "status":
          if (response.status) frontMatter[property] = response.status.name;
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
        },
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
    try {
      const response = await notion.users.retrieve({
        user_id: page.last_edited_by.id,
      });
      if (response.name) {
        frontMatter.authors = [response.name];
      }
    } catch (error) {
      console.warn(`[Warning] Failed to get author name for ${page.id}`);
    }
  }

  // save metadata
  frontMatter.NOTION_METADATA = page;
  frontMatter.MANAGED_BY_NOTION_HUGO = true;

  return {
    title,
    pageString:
      "---\n" +
      YAML.stringify(frontMatter, {
        defaultStringType: "QUOTE_DOUBLE",
        defaultKeyType: "PLAIN",
      }) +
      "\n---\n" +
      frontInjectString +
      "\n" +
      mdString,
  };
}

export async function savePage(
  page: PageObjectResponse,
  notion: Client,
  mount: DatabaseMount | PageMount,
) {
  const postpath = path.join(
    "content",
    mount.target_folder,
    getFileName(getPageTitle(page), page.id),
  );
  const post = getContentFile(postpath);
  if (post && post.metadata.last_edited_time === page.last_edited_time) {
    console.info(`[Info] The post ${postpath} is up-to-date, skipped.`);
    return;
  }
  // otherwise update the page
  console.info(`[Info] Updating ${postpath}`);

  const { title, pageString } = await renderPage(page, notion);
  const fileName = getFileName(title, page.id);
  await sh(`hugo new "${mount.target_folder}/${fileName}"`, false);
  fs.writeFileSync(`content/${mount.target_folder}/${fileName}`, pageString);
}

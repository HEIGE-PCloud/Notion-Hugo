import { Client, isFullPage } from "@notionhq/client";
import {
  PropertyItemListResponse,
  TitlePropertyItemObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

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

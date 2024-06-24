import { GetBlockResponse } from "@notionhq/client/build/src/api-endpoints";
import { Client } from "@notionhq/client";

export interface NotionToMarkdownOptions {
  notionClient: Client;
}

export type MdBlock = {
  type?: string;
  parent: string;
  children: MdBlock[];
  expiry_time?: string;
};

export type CalloutIcon =
  | { type: "emoji"; emoji: string }
  | { type: "external"; external: { url: string } }
  | { type: "file"; file: { url: string; expiry_time: string } }
  | null;

export type CustomTransformer = (
  block: GetBlockResponse
) => string | Promise<string>;

import {
  GetBlockResponse,
  PageIconResponse,
} from "@notionhq/client/build/src/api-endpoints";
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

export type CalloutIcon = PageIconResponse | null;

export type CustomTransformer = (
  block: GetBlockResponse
) => string | Promise<string>;

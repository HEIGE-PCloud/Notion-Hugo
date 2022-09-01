import { exec } from "child_process";
import toml from 'toml';
import fs from "fs-extra";
import { Client, isFullPage } from "@notionhq/client";
import { PropertyItemListResponse, TitlePropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
export async function sh(cmd: string): Promise<{stdout: string, stderr: string}> {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

export type mount = {
  database_id: string,
  target_folder: string,
}

export type config = {
  mounts: mount[]
}


export function loadConfig(): config {
  const configString = fs.readFileSync('config/notion.toml', 'utf8')      
  const config = toml.parse(configString) as config
  
  if (config.mounts === undefined || config.mounts === null || config.mounts.length === 0) {
    throw new SyntaxError("Error: No mounted folder is configured in notion.toml.");
  }

  return config
}

export async function getPageTitle(page_id: string, notion: Client): Promise<string> {
  const response = (await notion.pages.properties.retrieve({ page_id, property_id: 'title' })) as PropertyItemListResponse
  const titleResponse = response.results[0] as TitlePropertyItemObjectResponse
  const title = titleResponse.title.plain_text
  return title
}

export async function getCoverLink(page_id: string, notion: Client): Promise<string | null> {
  const page = await notion.pages.retrieve({ page_id })
  if (!isFullPage(page)) return null
  if (page.cover === null) return null
  if (page.cover.type === 'external') return page.cover.external.url
  else return page.cover.file.url
}
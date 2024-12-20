import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import fs from "fs";
import path from "path";
import fm from "front-matter";

type ContentFile = {
  filename: string;
  // relative path to the project folder
  filepath: string;
  metadata: PageObjectResponse;
  managed: boolean;
};

function isMarkdownFile(filename: string): boolean {
  return filename.endsWith(".md");
}

export function getContentFile(filepath: string): ContentFile | undefined {
  if (!fs.existsSync(filepath)) {
    return undefined;
  }
  const filedata = fm(fs.readFileSync(filepath, "utf-8"));
  const metadata = (filedata.attributes as any).NOTION_METADATA;
  if (metadata) {
    return {
      filename: path.basename(filepath),
      filepath,
      metadata,
      managed: (filedata.attributes as any).MANAGED_BY_NOTION_HUGO ?? false,
    };
  } else {
    console.warn(
      `[Warn] ${filepath} does not have NOTION_METADATA in its front matter`,
    );
    return undefined;
  }
}

export function getAllContentFiles(dirPath: string): ContentFile[] {
  const fileArray: ContentFile[] = [];
  const queue: string[] = [dirPath];
  while (queue.length !== 0) {
    const filepath = queue.shift();
    if (filepath === undefined) continue;
    if (fs.statSync(filepath).isDirectory()) {
      const files = fs.readdirSync(filepath);
      for (const file of files) {
        queue.push(path.join(filepath, file));
      }
      continue;
    }
    if (!isMarkdownFile(filepath)) continue;
    const filedata = fm(fs.readFileSync(filepath, "utf-8"));
    const metadata = (filedata.attributes as any).NOTION_METADATA;
    if (metadata) {
      fileArray.push({
        filename: path.basename(filepath),
        filepath,
        metadata,
        managed: (filedata.attributes as any).MANAGED_BY_NOTION_HUGO ?? false,
      });
    } else {
      console.warn(
        `[Warn] ${filepath} does not have NOTION_METADATA in its front matter, it will not be managed.`,
      );
    }
  }
  return fileArray;
}

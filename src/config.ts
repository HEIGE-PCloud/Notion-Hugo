import toml from "toml";
import fs from "fs-extra";

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

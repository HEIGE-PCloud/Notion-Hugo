const userDefinedConfig = require('../notion-hugo.config')

export type PageMount = {
  page_id: string;
  target_folder: string;
};

export type DatabaseMount = {
  database_id: string;
  target_folder: string;
};

export type Mount = {
  manual: boolean;
  page_url: string;
  databases: DatabaseMount[];
  pages: PageMount[];
};

export type EquationFormatter = {
  style: "markdown" | "shortcode" | "ssr";
};

export type Formatter = {
  equation: EquationFormatter;
};

export type Config = {
  mount: Mount;
  formatter: Formatter;
};

export function loadConfig(): Config {
  const userConfig = userDefinedConfig as UserConfig
  const config: Config = {
    mount: {
      manual: false,
      page_url: '',
      databases: [],
      pages: []
    },
    formatter: {
      equation: {
        style: 'ssr'
      }
    }
  }
  // check mount settings
  if (userConfig.mount.manual === false && userConfig.mount.page_url === undefined) {
    throw Error(`[Error] When mount.manual is false, a page_url must be set.`)
  }
  config.mount.manual = userConfig.mount.manual
  if (userConfig.mount.page_url) config.mount.page_url = userConfig.mount.page_url
  if (userConfig.mount.databases) config.mount.databases = userConfig.mount.databases
  if (userConfig.mount.pages) config.mount.pages = userConfig.mount.pages

  // check formatter settings
  if (userConfig.formatter?.equation) config.formatter.equation = userConfig.formatter.equation

  return config;
}

export type UserMount = {
  manual: boolean
  page_url?: string
  databases?: DatabaseMount[];
  pages?: PageMount[];
}

export type UserFormatter = {
  equation?: EquationFormatter;
}

export type UserConfig = {
  mount: UserMount
  formatter?: UserFormatter
}

export function defineConfig(config: UserConfig) {
  return config
}
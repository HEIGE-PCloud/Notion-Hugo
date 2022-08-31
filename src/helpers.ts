import { exec } from "child_process";
import toml from 'toml';
import fs from "fs-extra";

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
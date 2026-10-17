import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export interface AppConfig {
  env: "development" | "production" | "test";
  /** Everything the app persists lives here: the SQLite database, uploads, exports. */
  dataDir: string;
  /** Absolute path of the SQLite database file (inside `dataDir`). */
  databasePath: string;
  /** Public base URL of the site, without a trailing slash. OAuth redirects are built from it. */
  appUrl: string;
  /** GitHub OAuth App credentials; `null` until both are set (login is then disabled). */
  github: { clientId: string; clientSecret: string } | null;
  /**
   * Numeric GitHub user IDs allowed into `/admin` and to moderate any project. IDs, not logins:
   * a login can be renamed and then claimed by someone else.
   */
  adminGithubIds: number[];
}

/**
 * Reads the app configuration from environment variables.
 *
 * - `DATA_DIR` — defaults to `<repo>/data` locally; the Docker image sets `/externaldata`.
 * - `DATABASE_FILE` — file name inside `DATA_DIR`, defaults to `aitechleads.sqlite`.
 * - `APP_URL` — defaults to `http://localhost:3000`.
 * - `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` — GitHub OAuth App.
 * - `ADMIN_GITHUB_IDS` — comma-separated numeric GitHub user IDs (`https://api.github.com/users/<login>` → `id`).
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const dataDir = path.resolve(
    /* turbopackIgnore: true */ env.DATA_DIR ?? path.join(findWorkspaceRoot(), "data"),
  );
  const clientId = env.AUTH_GITHUB_ID?.trim();
  const clientSecret = env.AUTH_GITHUB_SECRET?.trim();

  return {
    env: env.NODE_ENV === "production" || env.NODE_ENV === "test" ? env.NODE_ENV : "development",
    dataDir,
    databasePath: path.join(/* turbopackIgnore: true */ dataDir, env.DATABASE_FILE ?? "aitechleads.sqlite"),
    appUrl: (env.APP_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
    github: clientId && clientSecret ? { clientId, clientSecret } : null,
    adminGithubIds: (env.ADMIN_GITHUB_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .map((id) => {
        if (!/^\d+$/.test(id)) throw new Error(`ADMIN_GITHUB_IDS: "${id}" is not a numeric GitHub user ID`);
        return Number(id);
      }),
  };
}

/**
 * The monorepo root: the closest directory, walking up from `cwd`, whose `package.json` declares
 * `workspaces`. Keeps local paths the same whether a script runs from the root or a package.
 */
export function findWorkspaceRoot(cwd = process.cwd()): string {
  for (let dir = cwd; ; dir = path.dirname(dir)) {
    const manifest = path.join(/* turbopackIgnore: true */ dir, "package.json");
    if (existsSync(manifest) && "workspaces" in JSON.parse(readFileSync(manifest, "utf8"))) {
      return dir;
    }
    if (dir === path.dirname(dir)) return cwd;
  }
}

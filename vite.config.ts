/** @file-id ER-FILE-VITE-CONFIG-0001
 * @module-id ER-MOD-BUILD-0001
 * @doc docs/source/vite.config.ts.docs.md
 * Vite configuration, including the repository project-site base path.
 */
import { defineConfig } from "vite";

// GitHub Pages serves this project from /MMORPG-typescript-/; local dev stays at /.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? "/MMORPG-typescript-/" : "/",
  build: { sourcemap: false },
  server: { host: "0.0.0.0" }
});

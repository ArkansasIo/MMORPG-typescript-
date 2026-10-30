import { defineConfig } from "vite";

// GitHub Pages serves this project from /MMORPG-typescript-/; local dev stays at /.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? "/MMORPG-typescript-/" : "/",
  build: { sourcemap: false },
  server: { host: "0.0.0.0" }
});

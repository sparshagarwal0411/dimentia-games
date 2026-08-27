import { existsSync, renameSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const renameHtmlOutput = {
  name: "rename-html-output",
  writeBundle() {
    const htmlOutput = resolve("dist/index.html");
    const htmOutput = resolve("dist/index.htm");
    if (existsSync(htmlOutput)) {
      renameSync(htmlOutput, htmOutput);
    }
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), renameHtmlOutput],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: "index.html",
    },
  },
});

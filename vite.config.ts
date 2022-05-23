import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
const genAlias = (aliases: Array<string>) =>
  aliases.map((alias) => ({
    find: alias,
    replacement: resolve(__dirname, "src", alias),
  }));

export default defineConfig({
  resolve: {
    alias: genAlias([
      "constant",
      "utils",
      "components",
      "pages",
      "app",
      "types",
      "presenters",
    ]),
  },
});

import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [remix(), netlifyPlugin(), tsconfigPaths()],
  css: {
    postcss: {
      plugins: [tailwind, autoprefixer],
    },
  },
});

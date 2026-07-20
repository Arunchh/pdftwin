import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  output: "static",
  outDir: "dist",
  build: {
    format: "directory",
  },
  vite: {
    server: {
      proxy: {
        "/api": "http://localhost:8000",
      },
    },
  },
});

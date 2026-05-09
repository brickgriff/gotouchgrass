// vite.config.js

import { defineConfig, loadEnv } from "vite";

export default ({mode}) => {
  const env = loadEnv(mode, /*process.env.cwd?.() ??*/  process.cwd(), "");

  return defineConfig({
    base: env.VITE_BASE || "/",
    build: {
      outDir: "docs"
    }
  });

};
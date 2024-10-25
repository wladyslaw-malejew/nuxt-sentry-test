// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import pkg from "./package.json";

fs.rmSync(path.join(__dirname, "dist-electron"), {
  recursive: true,
  force: true,
});

const viteElectronBuildConfig = {
  build: {
    minify: process.env.NODE_ENV === "production",
    rollupOptions: {
      external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
    },
  },
  resolve: {
    alias: {
      "~": __dirname,
    },
  },
};

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@sentry/nuxt/module",
    (options, nuxt) => {
      if (!nuxt.options.dev) {
        nuxt.options.nitro.runtimeConfig ??= {};
        nuxt.options.nitro.runtimeConfig.app ??= {};
        nuxt.options.nitro.runtimeConfig.app.baseURL = "./";
      }
    },
    [
      "nuxt-electron",
      {
        include: ["electron", "server"],
      },
    ],
  ],
  router: {
    options: {
      hashMode: true,
    },
  },
  typescript: {
    shim: false,
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       silenceDeprecations: ["legacy-js-api"],
  //     },
  //   },
  // },
  electron: {
    disableDefaultOptions: true,
    build: [
      {
        entry: "electron/main.ts",
        vite: viteElectronBuildConfig,
      },
      {
        entry: "electron/preload.ts",
        onstart(args) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          args.reload();
        },
        vite: viteElectronBuildConfig,
      },
    ],
  },
  experimental: {
    appManifest: false,
  },
  vite: {
    build: {
      sourcemap: "hidden",
      // rollupOptions: {
      //   onwarn(warning, warn) {
      //     // Suppress specific warnings containing '??'
      //     if (warning.message.includes("??")) {
      //       return;
      //     }
      //     // Handle all other warnings
      //     warn(warning);
      //   },
      // },
    },
    server: {
      middlewareMode: false,
    },
  },
  nitro: {
    sourceMap: false,
  },
  sentry: {
    sourceMapsUploadOptions: {
      enabled: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH,
      telemetry: false,
    },
  },
  sourcemap: true,
  ssr: false,

  runtimeConfig: {
    public: {
      sentryDsn: process.env.SENTRY_DSN,
    },
  },
});

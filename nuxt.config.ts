// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@sentry/nuxt/module"],
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
  router: {
    options: {
      hashMode: true,
    },
  },
  typescript: {
    shim: false,
  },
  // electron: {
  //   disableDefaultOptions: true,
  //   build: [
  //     {
  //       entry: "electron/main.ts",
  //       vite: viteElectronBuildConfig,
  //     },
  //     {
  //       entry: "electron/preload.ts",
  //       onstart(args) {
  //         // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
  //         // instead of restarting the entire Electron App.
  //         args.reload();
  //       },
  //       vite: viteElectronBuildConfig,
  //     },
  //   ],
  // },
  experimental: {
    appManifest: false,
  },
  vite: {
    build: {
      sourcemap: "hidden",
    },
    server: {
      middlewareMode: false,
    },
  },
  nitro: {
    sourceMap: false,
  },
  ssr: false,

  runtimeConfig: {
    public: {
      sentryDsn: process.env.SENTRY_DSN,
    },
  },
});

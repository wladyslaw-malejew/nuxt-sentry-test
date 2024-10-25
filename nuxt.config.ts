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
  vite: {
    build: {
      sourcemap: "hidden",
    },
  },
  nitro: {
    sourceMap: false,
  },
  ssr: false,
});

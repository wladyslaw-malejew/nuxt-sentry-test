import * as Sentry from "@sentry/nuxt";

const {
  public: { sentryDsn },
} = useRuntimeConfig();

Sentry.init({
  enabled: true,
  dsn: sentryDsn as string,
  environment: process.env.NODE_ENV || "development",

  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  // replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.feedbackIntegration({
      colorScheme: "light",
      autoInject: false,
    }),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
});

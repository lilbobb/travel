import * as Sentry from "@sentry/react-router";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://7f610e8c2c04a14be1f24dff58cc4601@o4509825728905216.ingest.de.sentry.io/4509825736704080",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  profilesSampleRate: 1.0, // profile every transaction
});

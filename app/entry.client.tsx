import * as Sentry from "@sentry/react-router";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

Sentry.init({
  dsn: "https://7f610e8c2c04a14be1f24dff58cc4601@o4509825728905216.ingest.de.sentry.io/4509825736704080",
  
  sendDefaultPii: true,
  integrations: [
    Sentry.reactRouterTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
   
      colorScheme: "system",
    }),
  ],

  enableLogs: true,
  tracesSampleRate: 1.0, 
  tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],
  
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});

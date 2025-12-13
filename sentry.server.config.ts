import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Only send errors in production
  enabled: process.env.NODE_ENV === "production",

  // Scrub sensitive data from server errors
  beforeSend(event) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers["authorization"];
      delete event.request.headers["cookie"];
      delete event.request.headers["x-api-key"];
    }

    // Remove sensitive data from request body
    if (event.request?.data) {
      const sensitiveFields = ["password", "token", "secret", "apiKey", "creditCard", "ssn"];
      try {
        const data = typeof event.request.data === "string"
          ? JSON.parse(event.request.data)
          : event.request.data;

        sensitiveFields.forEach(field => {
          if (data[field]) data[field] = "[REDACTED]";
        });

        event.request.data = JSON.stringify(data);
      } catch {
        // Not JSON, leave as is
      }
    }

    return event;
  },
});

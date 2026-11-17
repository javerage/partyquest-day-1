import { Hono } from "hono";

// Liveness only. This route does not read provider configuration or call a provider.
export const healthRoute = new Hono().get("/api/health", (context) =>
  context.json({ status: "ok" }, 200),
);

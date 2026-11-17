import { Hono } from "hono";

// Liveness only. Keep health independent of model configuration and providers.
export function createApp() {
  const app = new Hono();
  app.get("/api/health", (context) => context.json({ status: "ok" }, 200));
  return app;
}

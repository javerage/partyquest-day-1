import { serve } from "@hono/node-server";
import { createApp } from "./create-app";

// Local entry point. The npm scripts load `api/.env` when it exists, so server
// variables are available in `process.env` and never reach the browser.
// TODO(D1·B2.3): Pass `{ env: process.env }` to `createApp` once it accepts it.
const port = 8787;

serve({ fetch: createApp().fetch, port, hostname: "127.0.0.1" }, (info) => {
  console.log(`PartyQuest API listening on http://127.0.0.1:${info.port}`);
});

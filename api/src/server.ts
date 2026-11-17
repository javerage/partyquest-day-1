import { serve } from "@hono/node-server";
import { createApp } from "./app/create-app";

const port = 8787;
serve({ fetch: createApp().fetch, port, hostname: "127.0.0.1" }, (info) => {
  console.log(`PartyQuest API listening on http://127.0.0.1:${info.port}`);
});

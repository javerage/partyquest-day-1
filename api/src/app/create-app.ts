import { Hono } from "hono";
import { healthRoute } from "../features/health/presentation/http/health-route";

// Composition root: builds concrete dependencies and registers routes.
// Health stays independent of model configuration and providers.
//
// TODO(D1·B2.2): Accept `{ textGeneration }` (a `TextGenerationGateway`) so tests can
// pass a fake, build the use case with `createGenerateReply`, mount
// `createChatRoute(generateReply)` at `/api/chat` and register the common error
// handler with `app.onError`. Until D1·B2.3, when no gateway is injected use an inline
// gateway that returns the `configuration` failure, so the running server answers
// `configuration_error` and never a made-up reply. Until D1·B2.3 also pass
// `systemInstruction: ""` to `createGenerateReply`: the inline gateway never sends it,
// and no provisional instruction text is written. Read docs/architecture.md.
//
// TODO(D1·B2.3): Accept `{ env, fetch? }` and build `GroqTextGenerationAdapter` from
// `env.GROQ_API_KEY` and `env.GROQ_MODEL` when no gateway is injected, and replace the
// empty `systemInstruction` with `PACHI_SYSTEM_INSTRUCTION`. Missing Groq
// configuration must not prevent startup: chat reports it, health keeps working.
export function createApp() {
  const app = new Hono();
  app.route("/api/health", healthRoute);
  return app;
}

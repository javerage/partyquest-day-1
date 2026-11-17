// Groq adapter. It is the only file that may import `groq-sdk`.
//
// TODO(D1·B2.3): Export `GroqTextGenerationAdapter`, which implements
// `TextGenerationGateway` from `application/ports/text-generation-gateway.ts`. Its
// constructor receives `{ apiKey, model, fetch? }`; the values come from the server
// variables GROQ_API_KEY and GROQ_MODEL, read in `app/server.ts` and passed through
// `app/create-app.ts`. A missing key or model returns the `configuration` failure
// without calling the provider; quota and other provider errors map to `quota` and
// `provider`. Translate SDK types to the port types here; never log or return the key.
// Test it in `api/src/features/chat/tests/groq-text-generation-adapter.test.ts` with a
// fake `fetch`: deterministic tests never call the real provider.
// Read the Groq, configuration and provider-error sections of docs/api-contract.md.

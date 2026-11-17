// Chat use case. It depends only on the port in `ports/text-generation-gateway.ts`:
// no Hono, no Groq SDK and no HTTP types in this file.
//
// TODO(D1·B2.2): Export `createGenerateReply({ gateway, systemInstruction })`. The
// returned function receives the already validated current message, calls the gateway
// once with the server-owned system instruction and that message only (no history, no
// location), and returns the reply, model and normalized usage, or the failure kind.
// Test it in `api/src/features/chat/tests/generate-reply.test.ts` with a fake gateway.
// Read docs/api-contract.md and docs/architecture.md before this increment.

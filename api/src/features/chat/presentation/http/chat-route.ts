// HTTP edge of the chat feature. Nothing is registered yet: POST /api/chat answers 404
// until D1·B2.2. Never return a hardcoded reply that looks like a model answer.
//
// TODO(D1·B2.1): Write the contract tests first, in
// `api/src/features/chat/tests/chat-http.test.ts`, through the public app
// (`createApp().request(...)`) with a fake gateway. Observe them fail before B2.2.
// Read docs/01-chat-integration.md and docs/api-contract.md before this increment.
//
// TODO(D1·B2.2): Export `createChatRoute(generateReply)`. It parses the body with
// `parse-chat-request.ts`, calls the use case from `application/generate-reply.ts` and
// maps the result to `ChatResponseDto` or to the error envelope in
// `shared/http/api-error.ts`. Mount it at `/api/chat` in `app/create-app.ts`.
// Read docs/api-contract.md and docs/architecture.md before this increment.

// HTTP client of the chat feature. It is the only frontend file that calls the API.
//
// TODO(D1·B2.4): Export `createChatClient(): SendChatMessage`. It sends
// POST /api/chat (same-origin relative path) with the body `{ "message": "…" }` and
// nothing else: no history, no location, no key. It translates `ChatResponseDto` from
// `chat-dtos.ts` into the `ChatClientResult` type of `model/chat-result.ts`.
// Until D1·B3.1, a non-2xx response or a network failure must never become a reply:
// check `response.ok` and throw otherwise, without inventing a `code` or `retryable`.
// Test it in `frontend/src/features/chat/tests/chat-client.test.ts` with a fake
// `fetch`. Read docs/api-contract.md before this increment.
//
// TODO(D1·B3.1): Translate contract errors (`ApiErrorDto`), network failures and
// invalid responses into the `failure` result, keeping the contract `code` and
// `retryable` values. Never retry automatically.

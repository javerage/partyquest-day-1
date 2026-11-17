// Conversation state of the open page. Only the current message is sent to the API;
// visible exchanges live in memory and are not persisted on reload.
export type ChatMessage = { id: number; role: "user" | "pachi"; text: string };

export type ChatFailure = { code: string; retryable: boolean; messageId: number; text: string };

// TODO(D1·B2.4): Export `useChat(sendChatMessage)`. It keeps `messages`, the `pending`
// request and returns `send(text)`. `sendChatMessage` has the type `SendChatMessage`
// from `chat-result.ts`, so this file never imports transport code.
// Read docs/01-chat-integration.md and docs/api-contract.md before this increment.
//
// TODO(D1·B3.1): Keep the `failure` of the last request and add `retry()` (only when
// the failure is retryable, and only on a manual action) and `edit()`.
//
// TODO(D1·B3.2): Keep the accumulated `usage` and the `model` of the latest reply,
// using `addUsage` from `session-usage.ts`.
//
// TODO(D1·B6.2): Add `reset()`. A reply that arrives after the reset belongs to a
// discarded conversation and must be ignored.

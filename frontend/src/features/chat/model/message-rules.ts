// Client-side guard mirroring the contract: trimmed, non-empty, at most 2,000
// Unicode code points. The API still validates every request.
export const MAX_MESSAGE_CODE_POINTS = 2000;

export type MessageCheck = { status: "empty" } | { status: "too-long" } | { status: "ok"; message: string };

// TODO(D1·B2.4): Export `checkMessage(text): MessageCheck` applying the rule above.
// Read the request section of docs/api-contract.md before this increment.

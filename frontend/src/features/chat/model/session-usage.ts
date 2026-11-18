export type SessionUsage = {
  status: "complete" | "incomplete" | "unavailable";
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  // Theoretical estimate, not an invoice; null when it cannot be computed.
  costUsd: number | null;
};

// TODO(D1·B3.2): Export `addUsage(session, usage, model): SessionUsage`, which
// accumulates the usage of the visible conversation. A field missing in any response
// stays null for the whole session: null is never counted as zero. The cost uses
// `MODEL_RATES` from `model-rates.ts` and exists only when usage is complete.
// - `session` is `null` before the first reply; each reply calls `addUsage` once.
// - Status: "unavailable" while no reply has reported usage; "incomplete" when some
//   reply reported usage but a field is missing in any reply (a reply with `usage:
//   null` included); "complete" when every reply reported the three fields.
// - Cost: per reply, with the input and output rates of that reply's model, then
//   summed. It is null unless the status is "complete" and every model had a rate.
//   The contract usage has no cached tokens, so the cached rate is not used.
// Test it in `frontend/src/features/chat/tests/session-usage.test.ts` with complete,
// partial and missing usage. Read the usage section of docs/api-contract.md and the
// dated rates in docs/day-1/roadmap.md before this increment.

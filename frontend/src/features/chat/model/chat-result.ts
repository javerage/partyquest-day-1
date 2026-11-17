// Application-side result of one chat request. The HTTP client translates
// the contract into these types, so the model never imports transport code.
export type ResponseUsage = {
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
};

export type ChatClientResult =
  | { kind: "reply"; reply: string; model: string; usage: ResponseUsage | null }
  | { kind: "failure"; source: "contract" | "network" | "invalid_response"; code: string; retryable: boolean };

export type SendChatMessage = (message: string) => Promise<ChatClientResult>;

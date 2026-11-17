// HTTP DTOs of the D1 API contract as seen by the browser. The frontend is a
// separate application, so it keeps its own copy of the contract shapes.

export type ChatRequestDto = { message: string };

export type UsageDto = {
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
};

export type ChatResponseDto = { reply: string; model: string; usage: UsageDto | null };

export type ApiErrorDto = { error: { code: string; message: string; retryable: boolean } };

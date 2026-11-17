// HTTP DTOs of the D1 contract (browser ↔ API). Kept separate from
// application types and from Groq SDK types.

export type ChatRequestDto = { message: string };

export type UsageDto = {
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
};

export type ChatResponseDto = { reply: string; model: string; usage: UsageDto | null };

export type { ApiErrorCode, ApiErrorDto } from "../../../../shared/http/api-error";

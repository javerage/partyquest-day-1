// Output port owned by the chat use case. Infrastructure adapters (Groq)
// implement it with these application types, never with SDK types.

export type Usage = {
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
};

export type TextGenerationRequest = {
  systemInstruction: string;
  userMessage: string;
};

export type GenerationFailure = "configuration" | "quota" | "provider";

export type TextGenerationResult =
  | { ok: true; text: string | null; model: string; usage: Usage | null }
  | { ok: false; failure: GenerationFailure };

export interface TextGenerationGateway {
  generate(request: TextGenerationRequest): Promise<TextGenerationResult>;
}

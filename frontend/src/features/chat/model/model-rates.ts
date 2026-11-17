// Public Groq rates used for the theoretical cost (USD per million tokens,
// standard non-cached). Source: https://console.groq.com/docs/model/openai/gpt-oss-20b
// consulted 2026-10-27. Rates change; review before each workshop.
export type ModelRate = { inputUsdPerMillion: number; outputUsdPerMillion: number; consultedOn: string };

export const MODEL_RATES: Readonly<Record<string, ModelRate>> = {
  "openai/gpt-oss-20b": { inputUsdPerMillion: 0.075, outputUsdPerMillion: 0.3, consultedOn: "2026-10-27" },
};

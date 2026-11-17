import { MODEL_RATES } from "../model/model-rates";
import type { SessionUsage } from "../model/session-usage";

type UsagePanelProps = { usage: SessionUsage; model: string | null };

const tokens = (value: number | null) => (value === null ? "no disponible" : `${value} tokens`);

// D1-only usage strip. Missing values are shown as unavailable, never as zero.
export function UsagePanel({ usage, model }: UsagePanelProps) {
  const title = usage.status === "incomplete" ? "Consumo incompleto" : "Consumo de esta conversación";
  const rate = model ? MODEL_RATES[model] : undefined;

  return (
    <section
      aria-label={title}
      className="mb-2.5 flex flex-wrap items-center justify-between gap-x-3.5 gap-y-1.5 rounded-md border border-border bg-surface px-3 py-2.5 text-caption font-medium"
    >
      <b className="text-small">{title}</b>
      {usage.status === "unavailable" ? (
        <span className="text-text-muted">Sin datos de usage: no disponible.</span>
      ) : (
        <>
          <span>Entrada: {tokens(usage.inputTokens)}</span>
          <span>Salida: {tokens(usage.outputTokens)}</span>
          <span>Total: {tokens(usage.totalTokens)}</span>
          {usage.status === "incomplete" && <span className="text-info">No se recibió todo el usage.</span>}
          {usage.status === "complete" && (
            <span className="text-text-muted">
              {usage.costUsd !== null && rate
                ? `Costo teórico: US$${usage.costUsd.toFixed(6)} (estimación, tarifa del ${rate.consultedOn})`
                : "Costo teórico: no disponible"}
            </span>
          )}
        </>
      )}
    </section>
  );
}

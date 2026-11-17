// Pachi mascot (approved 2026-10-26), drawn from the D1 visual reference.
export type PachiExpression = "default" | "thinking" | "sorry";

type PachiProps = { expression?: PachiExpression; className?: string };

export function Pachi({ expression = "default", className }: PachiProps) {
  return (
    <svg viewBox="0 0 64 68" aria-hidden="true" focusable="false" className={className} data-expression={expression}>
      <path
        className="fill-pachi-body"
        d="M32 6C18.7 6 8 16.4 8 29.6 8 46.4 32 64 32 64s24-17.6 24-34.4C56 16.4 45.3 6 32 6Z"
      />
      <path
        d="M30 7c-1.5-3.5-5-4.6-7.5-3.6M33.5 6.6c1-3.8 4.6-5.4 7.6-4.6"
        fill="none"
        className="stroke-pachi-body"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="32" cy="29" r="16" className="fill-pachi-face" />
      <ellipse cx="22.5" cy="34" rx="3.2" ry="2.1" className="fill-highlight" opacity=".9" />
      <ellipse cx="41.5" cy="34" rx="3.2" ry="2.1" className="fill-highlight" opacity=".9" />
      <Face expression={expression} />
    </svg>
  );
}

function Face({ expression }: { expression: PachiExpression }) {
  const stroke = { fill: "none", className: "stroke-pachi-ink", strokeWidth: 2.4, strokeLinecap: "round" as const };
  if (expression === "thinking") {
    return (
      <>
        <ellipse cx="27.2" cy="25.2" rx="2.2" ry="2.9" className="fill-pachi-ink" />
        <ellipse cx="39.2" cy="25.2" rx="2.2" ry="2.9" className="fill-pachi-ink" />
        <path d="M35.6 19.8q3-1.8 5.8 0M28.5 35h7" {...stroke} />
      </>
    );
  }
  if (expression === "sorry") {
    return (
      <>
        <ellipse cx="26" cy="28" rx="2" ry="2.5" className="fill-pachi-ink" />
        <ellipse cx="38" cy="28" rx="2" ry="2.5" className="fill-pachi-ink" />
        <path d="M22.4 23.6l5.4-2.4M41.6 23.6l-5.4-2.4M27 35.5q2.5-2 5 0t5 0" {...stroke} />
      </>
    );
  }
  return (
    <>
      <ellipse cx="26" cy="27" rx="2.2" ry="2.9" className="fill-pachi-ink" />
      <ellipse cx="38" cy="27" rx="2.2" ry="2.9" className="fill-pachi-ink" />
      <path d="M26.5 33.5q5.5 5 11 0" {...stroke} />
    </>
  );
}

// Approved PartyQuest mascot (2026-10-26), copied as a presentation asset.
type PachiProps = { className?: string };

export function Pachi({ className }: PachiProps) {
  return (
    <svg viewBox="0 0 64 68" aria-hidden="true" focusable="false" className={className}>
      <path className="fill-pachi-body" d="M32 6C18.7 6 8 16.4 8 29.6 8 46.4 32 64 32 64s24-17.6 24-34.4C56 16.4 45.3 6 32 6Z" />
      <path d="M30 7c-1.5-3.5-5-4.6-7.5-3.6M33.5 6.6c1-3.8 4.6-5.4 7.6-4.6" fill="none" className="stroke-pachi-body" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="32" cy="29" r="16" className="fill-pachi-face" />
      <ellipse cx="22.5" cy="34" rx="3.2" ry="2.1" className="fill-highlight" opacity=".9" />
      <ellipse cx="41.5" cy="34" rx="3.2" ry="2.1" className="fill-highlight" opacity=".9" />
      <ellipse cx="26" cy="27" rx="2.2" ry="2.9" className="fill-pachi-ink" />
      <ellipse cx="38" cy="27" rx="2.2" ry="2.9" className="fill-pachi-ink" />
      <path d="M26.5 33.5q5.5 5 11 0" fill="none" className="stroke-pachi-ink" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

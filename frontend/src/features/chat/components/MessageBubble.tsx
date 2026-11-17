import { cn } from "../../../lib/cn";

export type BubbleVariant = "user" | "pachi" | "thinking";

type MessageBubbleProps = { variant: BubbleVariant; text: string };

export function MessageBubble({ variant, text }: MessageBubbleProps) {
  return (
    <div
      data-role={variant}
      className={cn(
        "max-w-[85%] whitespace-pre-wrap rounded-lg px-[13px] py-2.5 text-body [overflow-wrap:anywhere]",
        variant === "user"
          ? "self-end rounded-br-sm bg-brand-soft"
          : "self-start rounded-bl-sm border border-border bg-surface",
        variant === "thinking" && "text-text-muted",
      )}
    >
      {variant === "thinking" && (
        // Design system §4.3: with prefers-reduced-motion the waiting state is
        // communicated only with text, so the dots are hidden, not just stopped.
        <span className="mr-2 inline-flex gap-1 align-middle motion-reduce:hidden" aria-hidden="true">
          {[0, 140, 280].map((delay) => (
            <i
              key={delay}
              className="thinking-dot size-1.5 rounded-full bg-text-muted"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
      )}
      {text}
    </div>
  );
}

import { Button } from "../../../components/ui/button";

export type NoticeAction = { label: string; onClick: () => void; primary?: boolean };

type InlineNoticeProps = { title: string; body: string; actions: NoticeAction[] };

// Danger-tone notice (§7.10): what happened, what was kept, what to do.
export function InlineNotice({ title, body, actions }: InlineNoticeProps) {
  return (
    <div role="alert" className="w-full rounded-md border-l-4 border-danger bg-danger-soft px-3.5 py-[13px] text-text">
      <span className="mb-1 block font-extrabold">{title}</span>
      <p className="m-0 text-small">{body}</p>
      {actions.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button key={action.label} variant={action.primary ? "primary" : "secondary"} onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

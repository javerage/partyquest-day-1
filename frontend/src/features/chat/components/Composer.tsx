import { forwardRef, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "../../../components/ui/button";

type ComposerProps = {
  value: string;
  label: string;
  placeholder: string;
  submitLabel: string;
  canSubmit: boolean;
  hint: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

// Edits and emits the current message (no microphone in D1).
export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  { value, label, placeholder, submitLabel, canSubmit, hint, onChange, onSubmit },
  ref,
) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (canSubmit) onSubmit();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      submit(event);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="flex min-h-12 items-end gap-2 rounded-md border-[1.5px] border-border-strong bg-surface py-1.5 pr-2 pl-3">
        <textarea
          ref={ref}
          rows={1}
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          className="field-sizing-content max-h-24 min-h-9 flex-1 resize-none self-center bg-transparent py-1.5 text-body text-text outline-none placeholder:text-small placeholder:text-text-muted"
        />
        <Button type="submit" variant="primary" className="min-w-11" disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
      {hint && <p className="mt-1.5 mb-0 text-caption text-danger">{hint}</p>}
    </form>
  );
});

import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { ThemeSelector } from "../theme/ThemeSelector";

export function MenuSheet() {
  const [open, setOpen] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (sheet.current?.contains(event.target as Node)) return;
      if ((event.target as Element).closest?.("[aria-controls='d1-menu']")) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="justify-self-end">
      <button
        ref={trigger}
        type="button"
        aria-label="Menú"
        aria-controls="d1-menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-transparent text-text hover:bg-surface-sunken"
      >
        <Menu aria-hidden="true" size={24} />
      </button>
      {open && (
        <div
          ref={sheet}
          id="d1-menu"
          role="menu"
          aria-label="Menú"
          className="absolute inset-x-3 top-14 z-20 rounded-b-lg border border-border bg-surface p-3.5 shadow-2"
        >
          <button
            type="button"
            role="menuitem"
            disabled
            className="min-h-11 block w-full bg-transparent p-3 text-left text-body text-text-muted"
          >
            Historial y favoritos
          </button>
          <div role="separator" className="my-2 border-t border-border" />
          <ThemeSelector />
        </div>
      )}
    </div>
  );
}

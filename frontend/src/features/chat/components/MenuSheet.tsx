import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { ThemeSelector } from "../../theme/ThemeSelector";

type MenuSheetProps = { onClose: () => void };

// Menu overlay opened from the top bar. «Apariencia» is functional in the starter.
export function MenuSheet({ onClose }: MenuSheetProps) {
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (sheet.current?.contains(event.target as Node)) return;
      // The menu button toggles the sheet itself.
      if ((event.target as Element).closest?.("[aria-controls='d1-menu']")) return;
      onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose]);

  return (
    <div
      ref={sheet}
      className="absolute inset-x-3 top-14 z-20 rounded-b-lg border border-border bg-surface p-3.5 shadow-2"
    >
      {/* Design system §7.2: the menu closes with Esc, this close button or a tap outside.
          The button sits outside role="menu", which may only contain menu items. */}
      <div className="flex justify-end">
        <Button variant="text" className="min-w-11 p-2" aria-label="Cerrar menú" onClick={onClose}>
          <X aria-hidden="true" className="size-5" />
        </Button>
      </div>
      <div id="d1-menu" role="menu" aria-label="Menú">
        <button
          type="button"
          role="menuitem"
          disabled
          className="block min-h-11 w-full bg-transparent p-3 text-left text-body text-text-muted"
        >
          Historial y favoritos
        </button>
        <div role="separator" className="my-2 border-t border-border" />
        <ThemeSelector />
      </div>
    </div>
  );
}

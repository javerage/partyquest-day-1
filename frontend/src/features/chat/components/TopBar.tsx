import { Menu, SquarePen } from "lucide-react";
import type { RefObject } from "react";
import { Button } from "../../../components/ui/button";
import { Pachi, type PachiExpression } from "../../../components/ui/pachi";

type TopBarProps = {
  expression: PachiExpression;
  menuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  onNewPlan: () => void;
  onToggleMenu: () => void;
};

export function TopBar({ expression, menuOpen, menuButtonRef, onNewPlan, onToggleMenu }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-bg text-small font-bold">
      <Button variant="text" className="justify-self-start" onClick={onNewPlan}>
        <SquarePen aria-hidden="true" className="size-5" />
        Nuevo plan
      </Button>
      {/* Pachi identity: not a button and not focusable. */}
      <span className="flex items-center gap-1.5 justify-self-center">
        <Pachi expression={expression} className="h-[26px] w-6" />
        Pachi
      </span>
      <Button
        ref={menuButtonRef}
        variant="text"
        className="min-w-11 justify-self-end p-2"
        aria-label="Menú"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="d1-menu"
        onClick={onToggleMenu}
      >
        <Menu aria-hidden="true" className="size-5" />
      </Button>
    </header>
  );
}

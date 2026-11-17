import { SquarePen } from "lucide-react";
import { Pachi } from "../components/ui/pachi";
import { MenuSheet } from "../features/chat/MenuSheet";
import { useThemeSync } from "../features/theme/theme";

export function App() {
  useThemeSync();

  return (
    <div className="relative mx-auto flex h-dvh max-w-[480px] flex-col bg-bg px-4">
      <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-border text-small font-bold">
        <button
          type="button"
          disabled
          className="inline-flex min-h-11 items-center gap-1 justify-self-start bg-transparent p-0 text-text-muted opacity-60"
        >
          {/* TODO(D1·B6.2): Connect the shell action to the authorized conversation reset. */}
          <SquarePen aria-hidden="true" size={20} />
          Nuevo plan
        </button>
        <span className="flex items-center gap-1.5 justify-self-center" aria-label="Pachi">
          <Pachi className="h-[26px] w-6" />
          Pachi
        </span>
        <MenuSheet />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-5 text-center">
        <Pachi className="h-[102px] w-24" />
        <h1 className="m-0 text-display font-extrabold">¿Qué se arma hoy?</h1>
        <p className="max-w-sm text-body text-text-muted">
          Esta pantalla es la presentación inicial. Todavía no hay una conversación conectada.
        </p>
        {/* TODO(D1·B2.4): Connect this presentation to the public request/response contract.
            Read docs/01-chat-integration.md and docs/api-contract.md before this increment. */}
      </main>

      <footer className="shrink-0 border-t border-border bg-surface-sunken px-3 pt-2.5 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <label htmlFor="chat-message" className="sr-only">Mensaje para Pachi</label>
        <div className="flex min-h-12 items-end gap-2 rounded-md border-[1.5px] border-border-strong bg-surface py-1.5 pr-2 pl-3">
          <textarea
            id="chat-message"
            rows={1}
            disabled
            placeholder="El campo se conectará en un incremento posterior"
            className="min-h-9 min-w-0 flex-1 resize-none self-center bg-transparent py-1.5 text-body text-text outline-none placeholder:text-small placeholder:text-text-muted"
          />
          <button type="button" disabled className="min-h-11 shrink-0 rounded-md bg-action px-4 text-small font-bold text-on-action opacity-60">
            Enviar
          </button>
        </div>
      </footer>

      {/* TODO(D1·B6.1): Add the location presentation from the D1 interface reference.
          Read docs/day-1/interface-reference.md before this increment. */}
    </div>
  );
}

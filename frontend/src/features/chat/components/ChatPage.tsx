import { useCallback, useRef, useState } from "react";
import { Pachi } from "../../../components/ui/pachi";
import { Composer } from "./Composer";
import { MenuSheet } from "./MenuSheet";
import { TopBar } from "./TopBar";

// Single chat view. The starter only composes the presentation: no request is sent
// and no state of the conversation exists yet. Each TODO names the component or hook
// that the increment connects here; the components already exist in this folder.
// The exact interface copy of each increment is in its card in docs/day-1/roadmap.md.
export function ChatPage() {
  const [draft, setDraft] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const composer = useRef<HTMLTextAreaElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButton.current?.focus();
  }, []);

  // TODO(D1·B2.4): Receive `sendChatMessage` as a prop (created in `app/App.tsx` with
  // `createChatClient`), call `useChat(sendChatMessage)` and `checkMessage(draft)`, and
  // send only the current message. Read docs/01-chat-integration.md and
  // docs/api-contract.md before this increment.

  // TODO(D1·B6.1): Receive `geolocation` as a prop, call `useLocation(geolocation)` and
  // offer the location after the first message. Read docs/day-1/interface-reference.md.

  // TODO(D1·B6.2): Ask for confirmation with `ConfirmDialog` when there are messages;
  // confirming resets the conversation, the location or zone and the session usage.
  // Without messages, reset directly. Also clear the draft, the zone draft and an open
  // zone entry (`reset()` from `useLocation`); keep the theme. Do not change
  // `ConfirmDialog`: it already focuses «Cancelar», cancels on Escape and returns the
  // focus. After confirming, move the focus to the message field.
  const requestNewPlan = () => setMenuOpen(false);

  return (
    <div className="relative mx-auto flex h-dvh max-w-[480px] flex-col bg-bg px-4">
      {/* TODO(D1·B2.4): Pachi's expression is "thinking" while a request is pending.
          TODO(D1·B3.1): It is "sorry" while a failure is visible; "thinking" wins while a
          request is pending. */}
      <TopBar
        expression="default"
        menuOpen={menuOpen}
        menuButtonRef={menuButton}
        onNewPlan={requestNewPlan}
        onToggleMenu={() => setMenuOpen((open) => !open)}
      />
      {menuOpen && <MenuSheet onClose={closeMenu} />}

      <main className="flex flex-1 flex-col gap-3 overflow-y-auto px-1 py-[22px]">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-5 text-center">
          <Pachi className="h-[102px] w-24" />
          <h1 className="m-0 text-display font-extrabold">¿Qué se arma hoy?</h1>
          {/* TODO(D1·B2.4): Remove this starter note when the chat is connected, with no
              replacement text: sample D1-01 shows only the greeting. */}
          <p className="m-0 max-w-sm text-body text-text-muted">
            Esta pantalla es la presentación inicial. Todavía no hay una conversación conectada.
          </p>
        </div>
        {/* TODO(D1·B2.4): When there are messages or a pending request, render
            `MessageList` (messages, waiting) instead of the empty state above.
            TODO(D1·B3.1): Inside `MessageList`, render `InlineNotice` for the visible
            failure: quota exhausted has no actions; other failures offer «Editar
            mensaje» and, only when retryable, «Reintentar». Order: «Editar mensaje»
            (secondary), then «Reintentar» (`primary: true`). «Editar mensaje» puts the
            returned text in the composer and focuses it. Titles and bodies are in the
            D1·B3.1 card of docs/day-1/roadmap.md.
            TODO(D1·B6.1): Inside `MessageList`, render `LocationPrompt`. */}
      </main>

      <footer className="-mx-4 shrink-0 border-t border-border bg-surface-sunken px-3 pt-2.5 pb-[calc(12px+env(safe-area-inset-bottom))]">
        {/* TODO(D1·B3.2): Render `UsagePanel` above the composer when usage exists, that
            is, from the first reply on, even when that reply had no usage (the panel
            then says it is not available). Do not change `UsagePanel` or its copy. */}
        {/* TODO(D1·B2.4): `canSubmit` is true for a valid message with no pending
            request; `hint` shows the length notice below the field when the message
            exceeds the limit. Submitting sends the message and clears the draft.
            TODO(D1·B6.1): While the zone is being written, render the zone `Composer`
            instead of the message one (never both at once) with the zone labels from
            the D1·B6.1 card of docs/day-1/roadmap.md, and move the focus to it. After
            saving, the message `Composer` comes back. */}
        <Composer
          ref={composer}
          value={draft}
          label="Mensaje para Pachi"
          placeholder="Ej.: el domingo a mediodía, somos 4…"
          submitLabel="Enviar"
          canSubmit={false}
          hint={null}
          onChange={setDraft}
          onSubmit={() => {}}
        />
      </footer>
    </div>
  );
}

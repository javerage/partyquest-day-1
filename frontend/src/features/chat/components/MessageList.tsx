import type { ReactNode } from "react";
import type { ChatMessage } from "../model/use-chat";
import { MessageBubble } from "./MessageBubble";

type MessageListProps = { messages: ChatMessage[]; waiting: boolean; children?: ReactNode };

export function MessageList({ messages, waiting, children }: MessageListProps) {
  return (
    <div role="log" aria-live="polite" aria-label="Conversación con Pachi" className="flex flex-col gap-3">
      {messages.map((message) => (
        <MessageBubble key={message.id} variant={message.role} text={message.text} />
      ))}
      {waiting && <MessageBubble variant="thinking" text="Revisando opciones…" />}
      {children}
    </div>
  );
}

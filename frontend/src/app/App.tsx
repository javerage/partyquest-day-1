import { ChatPage } from "../features/chat/components/ChatPage";
import { useThemeSync } from "../features/theme/theme";

// TODO(D1·B2.4): Create the client once with `createChatClient()` from
// `features/chat/api/chat-client.ts` and pass it to `ChatPage` as `sendChatMessage`.
// TODO(D1·B6.1): Pass `navigator.geolocation` (or `undefined` when the browser has
// none) to `ChatPage` as `geolocation`.
export function App() {
  useThemeSync();
  return <ChatPage />;
}

# Mapa de archivos y TODO del proyecto D1

Lista de lo que el proyecto entrega y de dónde está cada `TODO`. Úsalo junto con las fichas del [roadmap](roadmap.md): la ficha dice qué pedir al agente; este mapa dice qué archivo contiene cada punto de trabajo.

> **Estado:** los archivos de esta lista existen en el proyecto. Instalación, tipos, build, health y la pantalla inicial se comprobaron en macOS; el recorrido de las fichas con un agente y la ejecución en Windows aún no se han ensayado.

## Forma de un TODO

Cada `TODO` dice ID, responsabilidad, nombre de lo que falta y documento que lo define. No contiene el algoritmo.

```ts
// TODO(D1·B2.2): Export `parseChatRequest(rawBody)`, which validates the request body
// of POST /api/chat exactly as docs/api-contract.md defines it …
```

Si un `TODO` no alcanza para decidir algo, el agente pregunta; no elige por su cuenta.

## API

| Archivo | Qué entrega | TODO |
|---|---|---|
| `api/src/app/server.ts` | Arranque local en `127.0.0.1:8787` | B2.3 |
| `api/src/app/create-app.ts` | Composición y ruta de health | B2.2, B2.3 |
| `api/src/features/health/presentation/http/health-route.ts` | `GET /api/health`, completo | — |
| `api/src/shared/http/api-error.ts` | Tipos del sobre de error y sus códigos | B2.2 |
| `api/src/features/chat/presentation/http/chat-dtos.ts` | Tipos de solicitud y respuesta HTTP, completos | — |
| `api/src/features/chat/presentation/http/chat-route.ts` | Sin ruta registrada: `/api/chat` responde 404 | B2.1, B2.2 |
| `api/src/features/chat/presentation/http/parse-chat-request.ts` | Solo el punto de trabajo | B2.2 |
| `api/src/features/chat/application/ports/text-generation-gateway.ts` | Puerto del gateway y sus tipos, completo | — |
| `api/src/features/chat/application/generate-reply.ts` | Solo el punto de trabajo | B2.2 |
| `api/src/features/chat/application/pachi-system-instruction.ts` | Solo el punto de trabajo | B2.3, B4.1 |
| `api/src/features/chat/infrastructure/groq/groq-text-generation-adapter.ts` | Solo el punto de trabajo | B2.3 |
| `api/vitest.config.ts` | Configuración de pruebas | — |
| `api/.env.example` | Nombres de variables con valores falsos | — |

Las pruebas no se entregan. El agente las crea en `api/src/features/chat/tests/` según cada ficha.

## Frontend

| Archivo | Qué entrega | TODO |
|---|---|---|
| `frontend/src/app/main.tsx`, `styles.css` | Arranque, tokens, tipografía y tema, completos | — |
| `frontend/src/app/App.tsx` | Monta la página | B2.4, B6.1 |
| `frontend/src/components/ui/button.tsx`, `pachi.tsx` | Botón y mascota con sus variantes, completos | — |
| `frontend/src/lib/cn.ts` | Utilidad de clases, completa | — |
| `frontend/src/features/theme/` | «Apariencia» funcional | — |
| `frontend/src/features/chat/components/ChatPage.tsx` | Composición de la pantalla, sin estado de conversación | B2.4, B3.1, B3.2, B6.1, B6.2 |
| `frontend/src/features/chat/components/TopBar.tsx`, `MenuSheet.tsx` | Barra y menú, completos | — |
| `frontend/src/features/chat/components/MessageList.tsx`, `MessageBubble.tsx`, `Composer.tsx` | Lista, burbujas y campo de mensaje, completos | — |
| `frontend/src/features/chat/components/InlineNotice.tsx`, `ConfirmDialog.tsx`, `UsagePanel.tsx` | Aviso, confirmación y panel de consumo, completos | — |
| `frontend/src/features/location/components/LocationPrompt.tsx` | Burbuja de ubicación con sus textos, completa | — |
| `frontend/src/features/chat/api/chat-dtos.ts` | Tipos del contrato vistos desde el navegador, completos | — |
| `frontend/src/features/chat/api/chat-client.ts` | Solo el punto de trabajo | B2.4, B3.1 |
| `frontend/src/features/chat/model/chat-result.ts` | Tipos del resultado de una petición, completos | — |
| `frontend/src/features/chat/model/message-rules.ts` | Límite y tipo de la validación | B2.4 |
| `frontend/src/features/chat/model/use-chat.ts` | Tipos de mensaje y fallo | B2.4, B3.1, B3.2, B6.2 |
| `frontend/src/features/chat/model/session-usage.ts` | Tipo del consumo de la sesión | B3.2 |
| `frontend/src/features/chat/model/model-rates.ts` | Tarifa fechada del modelo, completa | — |
| `frontend/src/features/location/model/use-location.ts` | Tipo del estado de ubicación | B6.1 |
| `frontend/src/test/setup.ts`, `frontend/vite.config.ts` | Configuración de pruebas | — |

Los componentes visuales están completos pero `ChatPage` todavía no usa `MessageList`, `InlineNotice`, `ConfirmDialog`, `UsagePanel` ni `LocationPrompt`: se conectan en sus incrementos. Las pruebas no se entregan; el agente las crea en `frontend/src/features/chat/tests/` y `frontend/src/features/location/tests/`.

## Qué no contiene el proyecto

- Ruta de chat, validación, caso de uso ni adaptador de Groq.
- Cliente HTTP, estado de conversación, acumulación de consumo, captura de ubicación ni reinicio.
- Pruebas del ejercicio ni la solución de referencia.
- Catálogo, RAG, voz, persistencia ni otras capacidades de días posteriores.

`POST /api/chat` no existe hasta B2.2 y responde 404. Nunca devuelve un saludo fijo que parezca una respuesta del modelo.

## Dependencias

Todas las dependencias del día están fijadas en los manifiestos y en `package-lock.json`, incluidas las de pruebas (`vitest`, Testing Library, `jsdom`) y `groq-sdk`. Ningún incremento necesita instalar paquetes; si el agente lo propone, no lo autorices sin consultar.

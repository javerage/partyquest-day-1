# Mapa de archivos del bundle de plantillas D1

> **Estado: mapa de preparación, bundle aún no ensamblado.** Este documento hace explícitos los archivos fuente que el equipo docente debe preparar. No es el bundle ni autoriza distribuir la aplicación de referencia completa. El equipo debe verificar rutas, enlaces, dependencias y que cada `TODO` cubra solo el incremento indicado antes de declarar el starter listo.

La persona participante crea `partyquest/` en clase y después incorpora el bundle siguiendo esta tabla. Los destinos presuponen workspaces `frontend/`, `api/` y carpeta pública `docs/`.

## Configuración base

| Material a preparar | Destino estudiante | Incremento | Contenido permitido |
|---|---|---|---|
| Manifiesto raíz con workspaces y scripts de arranque/test/typecheck/build | `package.json` | B1.1 | Scripts, workspace names y toolchain fijados; sin comportamiento del chat |
| Manifiesto frontend con versiones fijas | `frontend/package.json` | B1.1 | React/Vite/TypeScript/Tailwind y tooling de pruebas según receta verificada |
| Manifiesto API con versiones fijas | `api/package.json` | B1.1 | Hono/Node/TypeScript y runner; Groq solo al incremento de conexión |
| Lockfile único generado por el equipo con esos manifiestos | `package-lock.json` | B1.1 | Árbol reproducible; nunca lockfiles de workspace separados |
| Ignorados y configuración base de TypeScript/Vite/Tailwind | `.gitignore`, `frontend/tsconfig*.json`, `frontend/vite.config.ts`, configs TS | B1.2 | `.env` excluido, proxy local; sin CORS permisivo |
| Ejemplo de variables falsas | `api/.env.example` | B1.2 | Nombres/valores inequívocamente falsos, nunca una clave real |
| Reglas del agente estudiante | `AGENTS.md` | B1.2 | Copia de `templates/starter/AGENTS.md`; trabajo un incremento autorizado a la vez |

## Presentación frontend

Los siguientes archivos se derivan de la referencia funcional, pero el bundle debe copiar solo su presentación, no sus hooks de estado, clientes API ni comportamiento de chat.

| Destino estudiante | Elemento visual | TODO que podría portar | No copiar del código de referencia |
|---|---|---|---|
| `frontend/src/app/main.tsx`, `App.tsx`, `styles.css` | Arranque, tokens, layout vacío, tipografía y tema | `TODO(D1·B1.3)` en puntos de extensión de shell; selector de tema queda funcional porque forma parte del shell entregado | Creación de cliente chat/estado resuelto |
| `frontend/src/components/ui/pachi.tsx`, `button.tsx` | Mascota e interacción visual base | Solo notas de personalización si la guía las pide; no implementar nuevas variantes | Solución de uso de IA |
| `frontend/src/features/chat/components/TopBar.tsx`, `MenuSheet.tsx` | Barra y menú, «Apariencia» funcional | `TODO(D1·B6.2)` junto a acción «Nuevo plan» | Lógica de reset de la referencia |
| `frontend/src/features/chat/components/MessageList.tsx`, `MessageBubble.tsx`, `Composer.tsx` | Estructura, burbujas y entrada visual | `TODO(D1·B2.4)` conexión/envío; `TODO(D1·B6.2)` reinicio solo si existe evento visual | `use-chat`, llamadas HTTP e implementación completa |
| `frontend/src/features/chat/components/InlineNotice.tsx`, `ConfirmDialog.tsx`, `UsagePanel.tsx` | Plantillas de error/confirmación/usage | `TODO(D1·B3.1)`, `TODO(D1·B3.2)`, `TODO(D1·B6.2)` respectivamente | Mapeo resuelto de errores, acumulador de usage y reset |
| `frontend/src/features/location/components/LocationPrompt.tsx` | Presentación de permiso o zona | `TODO(D1·B6.1)` | Captura funcional de geolocation y estado resuelto |
| `frontend/src/features/chat/tests/` y `features/location/tests/` | — | No incluir la suite de aceptación de referencia; el estudiante crea pruebas por contrato en los incrementos | Tests completos de `example/partyquest/frontend/src/**/tests` |

Cada `TODO` debe decir responsabilidad + ID + documento, no el algoritmo. Ejemplo de forma permitida:

```tsx
// TODO(D1·B2.4): Connect this presentation to the public chat contract.
// Read docs/01-chat-integration.md and docs/api-contract.md before implementing.
```

La frase precisa se adapta a cada archivo; no se dejan TODOs genéricos sin ID, ni bloques enteros de la solución comentada.

## API base

| Destino estudiante | Base permitida | Incrementos |
|---|---|---|
| `api/src/app/server.ts`, `create-app.ts` | Servidor Node/Hono mínimo y composición | B1.2 |
| `api/src/features/health/**` | `GET /api/health` con respuesta pública sencilla | B1.4 |
| `api/src/features/chat/presentation/http/chat-route.ts` | Punto vacío tipado o archivo indicado por un TODO; sin respuesta simulada que parezca una respuesta de Groq | B2.1–B2.2 |
| `api/src/features/chat/application/ports/` | El estudiante define el port cuando su incremento lo requiera, leyendo arquitectura | B2.2 |
| `api/src/features/chat/infrastructure/groq/` | No entregar el adaptador Groq resuelto; `groq-sdk` se incorpora según el incremento y receta | B2.3 |
| `api/src/features/**/tests/` | No distribuir los tests completos de la solución de referencia | B2–B6 |

Un endpoint de chat ausente debe comunicarse como no implementado (p. ej. sin ruta/404 o estado contractual pendiente definido por la guía), nunca devolver un saludo hardcodeado como si conectara con Groq.

## Documentos públicos a copiar

| Fuente | Destino |
|---|---|
| `templates/starter/AGENTS.md` | `AGENTS.md` |
| `templates/starter/partyquest-d1-README.md` | `README.md` |
| `example/specs/day-1/roadmap.md` | `docs/day-1/roadmap.md` |
| `example/specs/day-1/agent-prompts.md` | `docs/day-1/agent-prompts.md` |
| `example/specs/day-1/template-file-map.md` | `docs/day-1/template-file-map.md` |
| `example/specs/day-1/theory.html` | `docs/day-1/theory.html` |
| `example/specs/01-chat-integration.md` | `docs/01-chat-integration.md` |
| `example/specs/day-1/api-contract.md` | `docs/api-contract.md` |
| `example/specs/day-1/architecture.md` | `docs/architecture.md` |
| `example/specs/day-1/setup-from-scratch.md` | `docs/day-1/setup-from-scratch.md` |
| `example/specs/day-1/interface-reference.md` | `docs/day-1/interface-reference.md` |
| `example/specs/day-1/interface-reference.html` | `docs/day-1/interface-reference.html` |

Después de copiar, ajustar rutas relativas según `course/specs/01-starter.md` y verificar todos los enlaces locales dentro del paquete ensamblado.

## Criterio para declarar bundle listo

- [ ] Cada ruta de destino existe en el bundle y su contenido corresponde a la fila.
- [ ] Las dependencias y el lockfile coinciden; instalación desde carpeta limpia observada.
- [ ] B1 arranca sin `GROQ_API_KEY`; health y pantalla vacía comprobados.
- [ ] Cada TODO remite a exactamente un incremento (o a varios solo si el roadmap lo documenta) y no filtra la solución.
- [ ] No hay hooks, llamadas, adaptadores, lógica o pruebas completas que resuelvan el ejercicio.
- [ ] `AGENTS.md`, roadmap, prompts y guías describen la misma regla de una autorización por incremento.
- [ ] Documentos internos y claves reales están ausentes.
- [ ] Enlaces y comandos funcionan en el paquete ensamblado.

**Estado al 2026-10-29:** el código de referencia está implementado; la separación de presentación/TODO descrita arriba aún no se ha materializado como bundle. No marcar los requisitos R2/R5 del starter como entregados hasta completar este checklist.

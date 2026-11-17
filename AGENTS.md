# Reglas del proyecto estudiante PartyQuest

Trabaja únicamente en el incremento D1 autorizado por la persona estudiante. El [roadmap](docs/day-1/roadmap.md) fija el orden y la evidencia; el [contrato API](docs/api-contract.md) y las especificaciones enlazadas fijan el comportamiento.

## Antes y durante cada cambio

- Lee la fila completa del incremento activo, sus prerrequisitos y los contratos públicos vinculados.
- Antes de editar, explica resultado observable, criterios, rutas candidatas y plan de verificación; espera autorización explícita para ese ID.
- Implementa solo ese incremento. Si falta una decisión, detente y pregunta; no inventes el comportamiento ni cambies el contrato.
- Conserva cambios ajenos. No marques el roadmap por la persona estudiante ni empieces el siguiente ID.
- Para cambios de comportamiento con pruebas deterministas, observa RED antes de GREEN. Prueba interfaces públicas y usa proveedores falsos; no uses claves reales.

## Arquitectura, UI y secretos

- Mantén frontend y API separados; solo el servidor comunica con Groq. La lógica central no depende de React, Hono ni SDK de proveedor.
- Antes de tocar UI, lee la referencia de interfaz del día. Reutiliza componentes, tokens e iconos; respeta `aria-label`, layout estable y movimiento reducido definidos por el contrato.
- Una UI requiere revisión en navegador a unos 360 px y escritorio. Pruebas simuladas no sustituyen esa revisión; informa como pendiente lo no observado.
- Las credenciales se leen solo en el servidor. Nunca las pongas en código, frontend, peticiones del navegador, fixtures, logs, capturas, respuestas ni documentación. `.env` local no es cifrado y debe estar ignorado; `.env.example` usa únicamente valores falsos.
- No agregues comportamiento futuro D2/D3 a D1. No instales software, accedas a cuentas, llames proveedores o despliegues sin autorización explícita.

## Informe de cierre

Indica archivos, comandos exactos, códigos de salida, resultados y fallos; separa pruebas simuladas de conectividad real. Enumera pruebas no ejecutadas y evidencia aún pendiente. La persona estudiante decide el estado del roadmap tras revisar la evidencia. Detente antes del siguiente incremento.

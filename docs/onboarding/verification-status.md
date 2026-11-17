# Qué está comprobado en esta entrega

Estado del 16 de noviembre de 2026. Este documento separa lo que se comprobó al preparar el proyecto de lo que cada participante todavía debe observar en su equipo.

## Comprobado en macOS

Entorno de preparación: Node.js `26.13.1`, npm `11.20.0`.

| Comprobación | Resultado observado |
|---|---|
| `npm ci` | Instalación desde el lockfile, código 0 |
| `npm test` | Código 0. El proyecto no trae pruebas del ejercicio: ambos workspaces informan que no hay archivos de prueba |
| `npm run test:setup` | 6 pruebas del diagnóstico aprobadas |
| `npm run typecheck` | Ambos workspaces sin errores |
| `npm run build` | API comprobada y frontend compilado |
| `GET /api/health` en `:8787` y por el proxy en `:5173` | HTTP 200, cuerpo exacto `{"status":"ok"}`, sin clave y sin cabecera CORS permisiva |
| `POST /api/chat` directo y por el proxy | HTTP 404 esperado: el chat no está implementado |
| Pantalla inicial a 360 px y a 1280 px | Carga; «Enviar» deshabilitado aunque se escriba; ninguna petición a `/api/chat` |
| Menú y «Apariencia» en ambos anchos | Claro, Oscuro y Sistema cambian el tema; Escape cierra y devuelve el foco; sin desbordes horizontales |

Las pruebas del diagnóstico usan herramientas falsas en un entorno Unix. No prueban la rama `npm.cmd` de Windows.

## No comprobado

- **Recorrido de las fichas con un agente.** Nadie ha completado todavía los `TODO` siguiendo los prompts del roadmap sobre este proyecto. Es la comprobación más importante que falta antes de la clase.
- **Windows:** instalación, comandos en PowerShell y la rama `npm.cmd` del diagnóstico.
- **OpenCode:** instalación, detección de las skills y conexión del agente a un proveedor.
- **Cuentas:** alta e inicio de sesión reales en Groq, Cohere y Vercel; disponibilidad, modelos, precios y cuotas.
- **Conectividad con Groq:** no se hicieron llamadas reales ni se usaron claves.
- **Tiempos de aula:** no hay ensayo de cuánto tarda cada incremento.

## Cómo registrar tu propia evidencia

Anota sistema, versiones, comando, código de salida y resultado, sin credenciales. Marca cada fila del [roadmap](../day-1/roadmap.md) solo después de comprobarla. Si no puedes ejecutar una comprobación, déjala pendiente y explica por qué.

[Volver a preparación](README.md) · [README del proyecto](../../README.md)

# PartyQuest — Día 1 del taller BotMode

Material para preparar el entorno y construir una primera conversación con Pachi, paso a paso y con ayuda de OpenCode. **No es la solución del ejercicio:** recibes presentación, referencias, skills y un esqueleto sin chat conectado.

> **Estado de esta entrega.** El proyecto base está completo: presentación, tipos de los contratos, dependencias fijadas y archivos con `TODO` para cada incremento. En macOS se comprobaron instalación, tipos, build, health y la pantalla inicial. **Aún no se ha ensayado** el recorrido de las fichas con un agente, ni la ejecución en Windows, OpenCode o las cuentas reales. Consulta la [evidencia y sus límites](docs/onboarding/verification-status.md).

## Empieza aquí

1. [Prepara Windows, OpenCode y las cuentas](docs/onboarding/README.md):
   - [Instalar Node.js y OpenCode en Windows](docs/onboarding/windows.md)
   - [Crear tu cuenta de Groq](docs/onboarding/groq.md)
   - [Crear tu cuenta de Cohere](docs/onboarding/cohere.md)
   - [Crear tu cuenta de Vercel](docs/onboarding/vercel.md)
2. [Revisa las cuatro skills incluidas](docs/onboarding/skills.md).
3. [Ejecuta el diagnóstico local](#diagnóstico-del-equipo).
4. [Consulta la guía del aula](docs/onboarding/classroom-guide.md) y el [roadmap D1](docs/day-1/roadmap.md).
   - [Presentación del Día 1](docs/day-1/slides.html) y [animación de bienvenida de Pachi](docs/day-1/pachi-intro.html): material de apoyo sin ensayar en clase.
   - [Teoría: del mensaje al modelo](docs/day-1/theory.html).
5. Avanza por las [fichas del roadmap](docs/day-1/roadmap.md#5-fichas-por-incremento): abres el archivo con el `TODO`, envías el prompt de la ficha a OpenCode, autorizas ese incremento y compruebas el resultado. Un incremento por autorización; no ejecutes el roadmap en cadena.

## Qué vas a construir

- Un frontend separado de una API propia.
- Envío del mensaje actual a la API, sin historial ni ubicación en la petición de D1.
- Una llamada del **servidor** a Groq; nunca desde el navegador.
- Estados de espera, respuesta, errores, cuota y consumo, según el contrato.
- Ubicación o zona local y «Nuevo plan», en sus incrementos.
- Pruebas deterministas que puedas explicar y distinguir de una llamada real.

D1 no incluye catálogo, RAG, filtrado, distancias, streaming, voz ni persistencia de conversaciones. No presentes respuestas del modelo como recomendaciones verificadas. Cohere y Vercel se preparan como cuentas en D1, pero se usan en etapas posteriores.

## Qué recibes y qué no

| Incluido | Lo construyes durante el ejercicio |
|---|---|
| Guías de entorno, cuentas y uso de OpenCode | Configuración autorizada del adaptador Groq en el servidor |
| Cuatro skills originales y reglas `AGENTS.md` | Pruebas del contrato e implementación por incremento |
| Pantalla, Pachi, componentes visuales y Apariencia | Comportamiento real del chat, errores, usage y reinicio |
| Tipos de los contratos y archivos con `TODO` por incremento | El código que cada `TODO` describe |
| API base y health sin clave | `/api/chat`, que todavía no existe en el starter |
| Contrato, arquitectura, referencia visual y teoría | Evidencia del resultado en tu propio equipo |

La [referencia visual](docs/day-1/interface-reference.html) muestra los estados objetivo; no significa que estén implementados. El [mapa de archivos](docs/day-1/template-file-map.md) lista qué entrega cada archivo y dónde está cada `TODO`. Las guías y pruebas de solución docentes no se distribuyen aquí.

## Diagnóstico del equipo

Primero verifica Node y npm en PowerShell:

```powershell
node --version
npm.cmd --version
```

Desde la raíz del proyecto:

```powershell
node ./scripts/check-environment.mjs
$LASTEXITCODE
```

Comprueba herramientas y una selección de archivos, sin instalar, consultar cuentas ni pedir claves. `0` indica que esas comprobaciones pasaron; `1` indica ausencias o versiones no reconocidas. **No acredita compatibilidad completa, una instalación correcta ni conexión a proveedores.** Si falta Node, sigue [Windows](docs/onboarding/windows.md) antes de intentar el script.

## Comandos del proyecto

En PowerShell se escribe `npm.cmd` en lugar de `npm` para no depender de la ejecución de scripts `.ps1`; no hace falta cambiar ExecutionPolicy. Estos comandos se comprobaron en macOS (como `npm`); en Windows aún no.

| Comando en PowerShell | Propósito |
|---|---|
| `npm.cmd ci` | Instalar exactamente el lockfile raíz; no requiere clave Groq |
| `npm.cmd run dev:api` | Iniciar API local, terminal A |
| `npm.cmd run dev:frontend` | Iniciar frontend, terminal B |
| `npm.cmd run dev` | Alias de frontend solamente; no inicia la API |
| `npm.cmd test` | Pruebas de API y frontend; el proyecto empieza sin pruebas y las creas en las fichas |
| `npm.cmd run typecheck` | Comprobar tipos de ambos workspaces |
| `npm.cmd run build` | Comprobar API y generar build frontend |
| `npm.cmd run test:setup` | Pruebas del diagnóstico, **no** aceptación del ejercicio |

La configuración usa API `http://127.0.0.1:8787` y frontend `http://127.0.0.1:5173`. Health directo y por el proxy deben devolver HTTP `200` y `{"status":"ok"}` sin clave. Chat ausente/404 es esperado hasta su implementación. No cambies CORS ni puertos para ocultar errores sin revisar el problema.

Las pruebas del diagnóstico usan fixtures de shell Unix y se ejecutaron en macOS. No las presentes como una suite validada en Windows ni como pruebas de la app.

## Documentos

- [Contrato API D1](docs/api-contract.md).
- [Arquitectura](docs/architecture.md).
- [Ejercicio E1](docs/01-chat-integration.md).
- [Roadmap y seguimiento](docs/day-1/roadmap.md).
- [Reglas para trabajar con el agente](docs/day-1/agent-prompts.md).
- [Mapa de archivos y TODO](docs/day-1/template-file-map.md).
- [Referencia de interfaz](docs/day-1/interface-reference.md) y [galería HTML](docs/day-1/interface-reference.html).
- [Teoría del Día 1](docs/day-1/theory.html): abre el HTML en el navegador.

## Seguridad y cuentas

Usa cuentas personales. No subas claves, contraseñas, tokens ni archivos `.env` reales al repositorio. No pegues credenciales en prompts, capturas, pruebas o mensajes del taller. La configuración del proveedor del agente y la del servidor PartyQuest son distintas.

Las páginas de Groq, Cohere, Vercel y OpenCode pueden cambiar. No se promete una modalidad gratuita, cuota o modelo disponible para todos. Si aparece un pago o un permiso inesperado, detente y consulta al facilitador.

Crear una cuenta o descargar este material no autoriza al agente a publicar, conectar repositorios, crear recursos remotos ni desplegar.

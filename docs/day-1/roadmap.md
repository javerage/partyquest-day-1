# PartyQuest: roadmap para construir el Día 1

Guía pública para cada participante y su agente de código. Define el objetivo, la secuencia, qué pedir al agente en cada paso y qué evidencia permite marcar un incremento como completado. Trabaja sobre tu copia: el estado empieza pendiente y se actualiza solo con evidencia observada.

**Alcance:** recibes el proyecto base ya creado, con la presentación, los documentos y archivos con `TODO`. Durante D1 completas esos `TODO` con ayuda del agente, un incremento autorizado a la vez. La [guía de creación desde carpeta vacía](setup-from-scratch.md) queda como referencia de cómo se construyó la base. Al cierre, el facilitador puede observar una llamada manual real con Groq; su guía y la solución de referencia son material docente y no se incluyen en este paquete.

## Prompts para copiar, ficha por ficha

**Los prompts que copias en OpenCode están en la [sección 5](#5-fichas-por-incremento) de este documento**, dentro de cada ficha: el **prompt 1 (alcance)** en el paso 2 y el **prompt 2 (autorización)** en el paso 4. Usa esta tabla para llegar directo a la ficha que te toca. Antes de B2.1 completa las fichas de [B1](#d1b1--instalar-y-comprobar-la-base-sin-editar), que se ejecutan en la terminal y no usan esos prompts.

| Ficha | Qué harás | Prompts |
|---|---|---|
| D1·B2.1 | Fijar el contrato con una prueba | [Ir a los prompts de B2.1](#d1b21--fijar-el-contrato-con-una-prueba) |
| D1·B2.2 | Validación y respuesta | [Ir a los prompts de B2.2](#d1b22--validación-y-respuesta-con-gateway-sustituible) |
| D1·B2.3 | Adaptador Groq en el servidor | [Ir a los prompts de B2.3](#d1b23--adaptador-groq-en-el-servidor) |
| D1·B2.4 | Conectar el envío desde la interfaz | [Ir a los prompts de B2.4](#d1b24--conectar-el-envío-desde-la-interfaz) |
| D1·B3.1 | Error recuperable y cuota agotada | [Ir a los prompts de B3.1](#d1b31--error-recuperable-y-cuota-agotada) |
| D1·B3.2 | Usage y costo teórico | [Ir a los prompts de B3.2](#d1b32--usage-y-costo-teórico) |
| D1·B4.1 | Comparar instrucciones de sistema | [Ir a los prompts de B4.1](#d1b41--comparar-instrucciones-de-sistema) |
| D1·B5.1 | Completar las pruebas del contrato | [Ir a los prompts de B5.1](#d1b51--completar-las-pruebas-del-contrato) |
| D1·B6.1 | Ubicación con permiso o zona escrita | [Ir a los prompts de B6.1](#d1b61--ubicación-con-permiso-o-zona-escrita) |
| D1·B6.2 | Confirmar «Nuevo plan» | [Ir a los prompts de B6.2](#d1b62--confirmar-nuevo-plan) |
| D1·B6.3 | Cierre local | [Ir a los prompts de B6.3](#d1b63--cierre-local) |

En GitHub, cada bloque de prompt tiene un botón de copiar en su esquina superior derecha. Copia el bloque completo; no necesitas modificarlo.

## 1. Resultado del día

Al terminar, la aplicación debe permitir:

1. escribir a Pachi desde la interfaz entregada y ver una respuesta;
2. enviar el mensaje actual desde el navegador a la API propia, que llama a Groq con `openai/gpt-oss-20b`;
3. mantener `GROQ_API_KEY` solo en el servidor;
4. mostrar los intercambios mientras la página permanezca abierta, sin enviar turnos anteriores al modelo ni persistirlos al recargar;
5. presentar los estados vacío, espera, error recuperable y cuota agotada;
6. capturar ubicación solo con permiso del navegador o permitir escribir una zona; D1 no clasifica cobertura, consulta catálogo ni calcula distancias;
7. confirmar «Nuevo plan» y limpiar intercambios, ubicación o zona y consumo de la sesión, sin revocar el permiso ni cambiar la cuota;
8. mostrar tokens y costo teórico cuando hay usage. Si falta, conservar la respuesta e indicar datos incompletos o no disponibles, nunca inventar cero;
9. escribir pruebas deterministas del contrato y explicar qué comprueban.

**Límite:** D1 no consulta catálogo ni corpus. Las respuestas pueden incluir datos no verificados; no las presentes como recomendaciones fundamentadas. La ubicación tampoco se envía al prompt de Groq.

## 2. Punto de partida y separación de responsabilidades

| Lo que recibes | Lo que implementas durante D1 |
|---|---|
| Proyecto npm con workspaces `frontend/` y `api/`, dependencias fijadas, comandos y configuración | Pruebas deterministas del contrato y el comportamiento de cada incremento |
| Documentos D1: roadmap, contrato, arquitectura, E1 y reglas del agente | API propia, llamada del servidor a Groq y conexión del chat |
| Presentación: tokens, Pachi, componentes visuales y menú «Apariencia» ya funcional | Estados de conversación, errores, usage y costo, ubicación o zona y «Nuevo plan» |
| Tipos de los contratos (DTO, puerto del gateway, resultados) y archivos con `TODO(D1·B#.#)` | Solo el comportamiento del incremento autorizado, en orden |
| Health sin clave; `POST /api/chat` responde 404 | Nada de RAG, catálogo, filtrado ni distancias durante D1 |

**Las decisiones de diseño ya están tomadas.** Cada `TODO` nombra el archivo, la función que falta y el documento que la define; el agente no elige estructura, nombres, librerías ni textos. Si falta una decisión, el agente se detiene y pregunta. **No rediseñes la interfaz.** Un `TODO` señala dónde se trabaja; no autoriza a continuar con el siguiente incremento.

## 3. Estado personal de incrementos

Estados permitidos: **pendiente**, **en curso**, **bloqueado** (anota qué falta) y **completado** (solo con la evidencia de la fila). No marques completado por quitar un `TODO` ni por el informe del agente. Anota en cada cierre el comando o acción, el resultado y los fallos.

En PowerShell escribe los comandos como `npm.cmd`; en otras terminales, `npm`.

| ID | Resultado observable | Previo | Checks para cerrar | Estado / evidencia personal |
|---|---|---|---|---|
| [D1·B1.1](#d1b11--instalar-dependencias) | Instalar las dependencias fijadas del proyecto recibido | Node y npm disponibles | `npm.cmd ci` termina con código 0; `npm.cmd ls --depth=0` muestra los dos workspaces | Pendiente — |
| [D1·B1.2](#d1b12--comprobar-la-base) | Comprobar configuración, reglas del agente y archivos del proyecto | B1.1 | `npm.cmd run check:env` y `npm.cmd run typecheck` con código 0; `.gitignore` excluye `.env`; `api/.env.example` solo tiene valores falsos | Pendiente — |
| [D1·B1.3](#d1b13--abrir-la-pantalla) | Ver la pantalla inicial sin comportamiento de chat | B1.2 | `npm.cmd run dev:frontend`; la pantalla carga a 360 px y en escritorio; «Apariencia» cambia el tema; «Enviar» está deshabilitado | Pendiente — |
| [D1·B1.4](#d1b14--comprobar-api-y-proxy) | Comprobar `GET /api/health` directo y por el proxy | B1.3 | HTTP 200 `{"status":"ok"}` sin clave en `:8787` y en `:5173`; `POST /api/chat` responde 404; sin CORS permisivo | Pendiente — |
| [D1·B2.1](#d1b21--fijar-el-contrato-con-una-prueba) | Fijar con una prueba el contrato mínimo del mensaje actual | B1.4 | Prueba por la interfaz pública con status y cuerpo exactos; se observa que falla (RED) antes de implementar | Pendiente — |
| [D1·B2.2](#d1b22--validación-y-respuesta-con-gateway-sustituible) | Implementar validación y respuesta del servidor mediante un gateway sustituible | B2.1 | JSON inválido y campos extra rechazados antes del gateway; pruebas con gateway falso en verde; sin secretos en errores | Pendiente — |
| [D1·B2.3](#d1b23--adaptador-groq-en-el-servidor) | Conectar el adaptador Groq en la API, solo con variables de entorno del servidor | B2.2 | Clave ausente produce `configuration_error`; las pruebas siguen usando un `fetch` falso; la clave no aparece en bundle, petición ni logs | Pendiente — |
| [D1·B2.4](#d1b24--conectar-el-envío-desde-la-interfaz) | Conectar el envío desde la interfaz y mostrar la respuesta | B2.3 | El cuerpo enviado por el navegador contiene solo `{ "message": "…" }`; la respuesta aparece; no se envía historial | Pendiente — |
| [D1·B3.1](#d1b31--error-recuperable-y-cuota-agotada) | Mostrar error recuperable y cuota agotada | B2.4 | Respuestas HTTP falsas; textos de la ficha; reintento solo manual y solo cuando procede | Pendiente — |
| [D1·B3.2](#d1b32--usage-y-costo-teórico) | Mostrar y acumular usage y costo teórico | B2.4 | Usage parcial o ausente no pierde la respuesta ni se convierte en cero; costo contra la tarifa fechada | Pendiente — |
| [D1·B4.1](#d1b41--comparar-instrucciones-de-sistema) | Comparar instrucciones de sistema con el mismo mensaje | B2.4 | Registro de instrucción y observación, sin afirmar que el modelo comprueba hechos; ninguna llamada sin permiso ni clave | Pendiente — |
| [D1·B5.1](#d1b51--completar-las-pruebas-del-contrato) | Completar las pruebas deterministas del contrato | B2.1–B3.2 | Límites y errores que nombra el contrato cubiertos; anotado qué no demuestra cada prueba | Pendiente — |
| [D1·B6.1](#d1b61--ubicación-con-permiso-o-zona-escrita) | Capturar ubicación con permiso o zona escrita, sin enviarla a Groq | B2.4 | Permiso concedido, denegado y no disponible; la petición y el prompt no incluyen ubicación | Pendiente — |
| [D1·B6.2](#d1b62--confirmar-nuevo-plan) | Confirmar «Nuevo plan» y reiniciar solo la conversación | B3.2, B6.1 | Cancelar conserva; confirmar limpia intercambios, ubicación y usage, no cuota ni tema; nada persiste al recargar | Pendiente — |
| [D1·B6.3](#d1b63--cierre-local) | Cierre local completo con pruebas simuladas; llamada real opcional y separada | B1–B6 | Pruebas, typecheck, build y recorrido manual; si se prueba Groq, evidencia sin credenciales | Pendiente — |

**Registro de llamadas reales.** Las pruebas simuladas no gastan cuota; cada llamada real a Groq sí. Anota aquí las que hagas, aparte de la evidencia de las pruebas, y nunca copies la clave:

| Ficha | Llamadas | Modelo | Resultado | Nota |
| --- | --- | --- | --- | --- |
| Ejemplo: D1·B3.2 | 2 | `openai/gpt-oss-20b` | 200 con usage | El costo acumulado aumentó |

## 4. Cómo trabajar con el agente

**Una ficha, un incremento, una autorización.** Cada ficha de la sección 5 trae su **paso a paso** (índice: [prompts para copiar, ficha por ficha](#prompts-para-copiar-ficha-por-ficha)) con dos prompts ya completos, listos para copiar en OpenCode:

1. **Prompt 1 (alcance):** el agente lee la ficha y explica qué va a hacer, sin editar.
2. **Prompt 2 (autorización):** después de revisar la explicación, autorizas solo esa ficha. Si hay una prueba aplicable, el agente la escribe primero y la ve fallar; luego implementa.

Entre los dos prompts revisas la propuesta. Después compruebas con los checks de la ficha y anotas el resultado en la sección 3. No necesitas armar ni modificar los prompts: copia el bloque completo.

**Qué hace cada quien:**

| El agente | Tú |
| --- | --- |
| Lee la ficha, propone el alcance y lo explica sin editar | Revisas la propuesta y autorizas solo esa ficha |
| Escribe las pruebas, las ve fallar e implementa | Revisas su informe con la lista de la ficha |
| Ejecuta pruebas y typecheck con proveedores falsos | Haces la revisión en el navegador y las llamadas reales a Groq |
| Informa como pendiente lo que no observó | Marcas el estado y la evidencia en la sección 3 |

El agente no hace llamadas reales ni revisión en navegador, y no necesita pedirte permiso para ellas: si te lo pregunta, respóndele que las haces tú.

**Una sesión nueva de OpenCode por ficha.** Si continúas en la misma sesión, el agente puede seguir razonando con versiones de archivos que ya cambiaron.

**Un fallo intermedio es normal.** Que el agente vea fallar su primera implementación y la corrija con las pruebas es buena señal. Desconfía si **cambia una prueba para que pase** sin explicar por qué.

No pegues varias fichas como una orden para ejecutar en cadena. Las [reglas para trabajar con el agente](agent-prompts.md) explican qué hacer cuando la evidencia no alcanza.

## 5. Fichas por incremento

Las rutas son relativas a la raíz del proyecto. «Abre» es el archivo cuyo `TODO` lees primero; «También» son los demás archivos con `TODO` del mismo ID; «Pruebas» es el archivo de pruebas que el agente crea. Sigue el **paso a paso** de cada ficha en orden.

### D1·B1 — Instalar y comprobar la base (sin editar)

**Requisito de entrada:** completa primero la [preparación del equipo](../onboarding/README.md), incluso si ya clonaste. Git, Node.js/npm, OpenCode y Gentle AI deben estar preparados; en Windows también Go para instalar Gentle AI. Este bloque comienza con el equipo listo. Tú ejecutas estos pasos en PowerShell, no el agente. La sección 3 sirve para registrar resultados; esta sección explica cómo obtenerlos. No modificarás el código ni resolverás los `TODO`; instalar dependencias sí crea archivos locales en `node_modules`.

#### D1·B1.1 — Instalar dependencias

1. Si ya clonaste, usa esa carpeta y no repitas la descarga. Si aún no tienes el proyecto, abre PowerShell en la carpeta donde quieras guardarlo y ejecuta:

   ```powershell
   git clone https://github.com/javerage/partyquest-day-1.git
   cd partyquest-day-1
   ```

   Abre PowerShell en la raíz del repositorio clonado, no dentro de `api/` ni de `frontend/`. Comprueba:

   ```powershell
   Get-Location
   Test-Path package.json
   Test-Path package-lock.json
   ```

   Los dos últimos comandos deben devolver `True`. Si no, abre la carpeta correcta antes de seguir.

2. Comprueba Node.js y npm:

   ```powershell
   node --version
   npm.cmd --version
   ```

   Ambos deben imprimir una versión. Node.js ejecuta JavaScript fuera del navegador; npm viene con Node.js y administra las dependencias. Si no se reconocen, sigue la [guía de Windows](../onboarding/windows.md) y vuelve a abrir PowerShell después de instalar las herramientas.

   Usamos `npm.cmd` para evitar el bloqueo de `npm.ps1` en PowerShell, sin cambiar la política de seguridad de Windows. En macOS/Linux usa `npm`; para comprobar la carpeta, usa `pwd` y `ls package.json package-lock.json`.

3. Desde esa misma raíz, instala las versiones fijadas en el proyecto:

   ```powershell
   npm.cmd ci
   ```

   Clonar descarga el código, pero no sus dependencias. Este comando necesita conexión para descargarlas y prepara ambas aplicaciones. Espera a que termine y vuelva el prompt; ejecuta inmediatamente `$LASTEXITCODE`: debe mostrar `0`. Si falla, conserva el error y consulta al instructor; no borres el lockfile ni actualices dependencias para intentar resolverlo.

4. Ejecuta `npm.cmd ls --depth=0`. Debe mostrar los dos workspaces, API y frontend, sin dependencias faltantes. Anota el resultado en B1.1 de la sección 3.

#### D1·B1.2 — Comprobar la base

1. En la misma terminal y carpeta, ejecuta `npm.cmd run check:env`. Al terminar, consulta `$LASTEXITCODE`: debe ser `0`. El diagnóstico comprueba herramientas y archivos, no credenciales ni conectividad con Groq. Si informa `OpenCode: no disponible (requerido)`, OpenCode no quedó listo en la preparación del equipo: comprueba `opencode --version` en una terminal nueva y sigue [«Si algo falla» de la guía de Windows](../onboarding/windows.md#si-algo-falla). No continúes con B1.3 hasta que el diagnóstico termine en `0`. `Git (opcional)` no hace fallar el diagnóstico.
2. Ejecuta `npm.cmd run typecheck`. Debe terminar sin errores de TypeScript y con `$LASTEXITCODE` igual a `0`.
3. Lee `AGENTS.md` y comprueba en el editor los criterios de configuración de la fila B1.2 de la sección 3. No necesitas una clave de Groq para comprobar la base. Registra el resultado.

**Si una comprobación falla, detente antes de la siguiente:** conserva el mensaje sin claves y consulta al instructor. No pidas al agente que implemente ejercicios para corregir un problema de preparación.

#### D1·B1.3 — Abrir la pantalla

1. En esta terminal, desde la raíz, ejecuta:

   ```powershell
   npm.cmd run dev:frontend
   ```

   El proceso permanece ejecutándose: no esperes a que vuelva el prompt ni cierres esta terminal. Debe indicar la dirección local; si el puerto está ocupado o muestra otro, consulta al instructor.

2. Abre **http://127.0.0.1:5173** en el navegador. Debes ver la pantalla inicial de Pachi. Abre el menú y prueba «Apariencia». **«Enviar» está deshabilitado intencionalmente**: conectar el chat es un ejercicio posterior.
3. Comprueba la pantalla en escritorio y a 360 px de ancho con el modo de dispositivos de las herramientas del navegador. No debe haber desplazamiento horizontal. Anota B1.3 y deja la terminal abierta.

#### D1·B1.4 — Comprobar API y proxy

1. Abre una **segunda terminal PowerShell en la misma raíz** y ejecuta:

   ```powershell
   npm.cmd run dev:api
   ```

   Déjala abierta. Ahora el frontend y la API se ejecutan en terminales separadas. Al terminar el trabajo podrás detener cada proceso con `Ctrl+C`.

2. Abre ambas direcciones en el navegador:

   - **http://127.0.0.1:8787/api/health**: API directa.
   - **http://127.0.0.1:5173/api/health**: API mediante el proxy del frontend.

   Las dos deben mostrar `{"status":"ok"}`. Si solo funciona la primera, consulta al instructor antes de avanzar.

3. Abre una **tercera terminal PowerShell**, dejando las otras dos en ejecución, y comprueba las respuestas HTTP:

   ```powershell
   curl.exe -i http://127.0.0.1:8787/api/health
   curl.exe -i http://127.0.0.1:5173/api/health
   curl.exe -i -X POST http://127.0.0.1:8787/api/chat
   curl.exe -i -H "Origin: https://example.com" http://127.0.0.1:8787/api/health
   ```

   Las dos primeras deben responder HTTP `200` con `{"status":"ok"}`. El POST debe responder `404`: aún no existe la ruta del chat; **no es un fallo de instalación**. La última respuesta no debe incluir `Access-Control-Allow-Origin: *` ni autorizar `https://example.com`. En macOS/Linux usa `curl` en lugar de `curl.exe`.

4. Anota B1.4 en la sección 3. Si los resultados no coinciden, detente y consulta al instructor.

#### Equipo y base comprobados: comenzar los ejercicios

Gentle AI y el acceso al modelo de OpenCode ya se prepararon antes de B1.1. No necesitas instalarlos de nuevo. Mantén las terminales de API y frontend abiertas y usa una tercera terminal en la raíz para ejecutar `opencode`.

Comprueba las [skills del proyecto](../onboarding/skills.md) antes de solicitar cambios. Después sigue D1·B2.1, empezando por su prompt 1. No autorices varias fichas a la vez.

### D1·B2.1 — Fijar el contrato con una prueba

**Datos de la ficha**

- **Abre:** `api/src/features/chat/presentation/http/chat-route.ts`
- **Pruebas:** `api/src/features/chat/tests/chat-http.test.ts`
- **Lectura:** [contrato API](../api-contract.md), secciones de solicitud, respuesta y errores; [E1](../01-chat-integration.md)

**Paso a paso**

1. Abre `api/src/features/chat/presentation/http/chat-route.ts` y lee su `TODO(D1·B2.1)`.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D1·B2.1. Lee AGENTS.md, la ficha de D1·B2.1 en
   docs/day-1/roadmap.md, los TODO(D1·B2.1) de los archivos que indica y sus
   lecturas. Objetivo: Especificar y probar solo el contrato del mensaje actual por
   la API pública, con un gateway falso. Propón las pruebas deterministas y sus
   resultados observables. No implementes la ruta todavía. Todavía no edites ni
   ejecutes cambios. Explícame el resultado observable, el concepto, los archivos
   que vas a tocar, las pruebas y comprobaciones, y cualquier decisión que falte.
   Para cada decisión, cita el archivo y la línea que la definen, y separa lo que
   ya fijan el contrato, los TODO o las pruebas existentes de lo que propones tú.
   Si una prueba de una ficha anterior ya fija un valor, úsalo. Espera mi
   autorización explícita.
   ```

3. Revisa la respuesta. Debe limitarse a esta ficha, con estos archivos: `chat-route.ts`, `chat-http.test.ts`. Si menciona otro ID o archivos distintos, pídele que se ajuste a la ficha antes de autorizar.
4. Copia el **prompt 2 (autorización)**. El agente implementa solo esta ficha.

   ```text
   Autorizo únicamente D1·B2.1 según el alcance que explicaste. Usa los archivos,
   nombres y textos que indican los TODO, la ficha, el contrato y las pruebas ya
   escritas; no elijas otra estructura ni agregues dependencias. Si hay pruebas
   deterministas aplicables, escribe primero la prueba y observa que falle; después
   implementa y mantén las comprobaciones en verde. No resuelvas TODO de otros ID,
   no cambies contratos y no hagas commits ni push. No hagas llamadas reales al
   proveedor ni revisión en navegador: las hago yo después; repórtalas como
   pendientes. Informa archivos, comandos, resultados, fallos y comprobaciones no
   ejecutadas. No marques el roadmap por mí y detente antes del siguiente
   incremento.
   ```

5. Comprueba: `npm.cmd test --workspace api` falla porque la ruta no existe (404), no por un error de sintaxis. `typecheck` puede fallar hasta B2.2 porque la prueba usa una opción de `createApp` que aún no existe; anótalo.
6. Anota en la tabla de la sección 3 el estado y lo que observaste. Detente aquí: la siguiente ficha empieza con su propio prompt 1.

### D1·B2.2 — Validación y respuesta con gateway sustituible

**Datos de la ficha**

- **Abre:** `api/src/features/chat/presentation/http/parse-chat-request.ts`
- **También:** `api/src/features/chat/application/generate-reply.ts`, `api/src/features/chat/presentation/http/chat-route.ts`, `api/src/shared/http/api-error.ts`, `api/src/app/create-app.ts`
- **Pruebas:** las de B2.1 y `api/src/features/chat/tests/generate-reply.test.ts`
- **Lectura:** [contrato API](../api-contract.md), validación y errores; [arquitectura](../architecture.md)

**Paso a paso**

1. Abre `api/src/features/chat/presentation/http/parse-chat-request.ts` y lee su `TODO(D1·B2.2)`.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D1·B2.2. Lee AGENTS.md, la ficha de D1·B2.2 en
   docs/day-1/roadmap.md, los TODO(D1·B2.2) de los archivos que indica y sus
   lecturas. Objetivo: Implementar solo la validación HTTP, el caso de uso y la
   ruta sobre el puerto del gateway ya definido. No conectes el proveedor real ni
   la interfaz. Lo inválido se rechaza antes de llamar al gateway. Todavía no
   edites ni ejecutes cambios. Explícame el resultado observable, el concepto, los
   archivos que vas a tocar, las pruebas y comprobaciones, y cualquier decisión que
   falte. Para cada decisión, cita el archivo y la línea que la definen, y separa
   lo que ya fijan el contrato, los TODO o las pruebas existentes de lo que
   propones tú. Si una prueba de una ficha anterior ya fija un valor, úsalo. Espera
   mi autorización explícita.
   ```

3. Revisa la respuesta. Debe limitarse a esta ficha, con estos archivos: `parse-chat-request.ts`, `generate-reply.ts`, `chat-route.ts`, `api-error.ts`, `create-app.ts`, `generate-reply.test.ts`. Si menciona otro ID o archivos distintos, pídele que se ajuste a la ficha antes de autorizar.

   **Si el agente pregunta…** Estas decisiones ya están fijadas; si las presenta como abiertas, indícale la fuente:

   - `systemInstruction: ""` hasta B2.3: lo indica el `TODO(D1·B2.2)` de `create-app.ts`. No se redacta un texto provisional.
   - El `message` de cada error: columna `message` de la tabla de errores del [contrato API](../api-contract.md).
   - El cuerpo se lee con `c.req.text()`, no con `c.req.json()`, para que el JSON inválido responda `400 invalid_request`: lo indica el `TODO(D1·B2.2)` de `chat-route.ts`.
4. Copia el **prompt 2 (autorización)**. El agente implementa solo esta ficha.

   ```text
   Autorizo únicamente D1·B2.2 según el alcance que explicaste. Usa los archivos,
   nombres y textos que indican los TODO, la ficha, el contrato y las pruebas ya
   escritas; no elijas otra estructura ni agregues dependencias. Si hay pruebas
   deterministas aplicables, escribe primero la prueba y observa que falle; después
   implementa y mantén las comprobaciones en verde. No resuelvas TODO de otros ID,
   no cambies contratos y no hagas commits ni push. No hagas llamadas reales al
   proveedor ni revisión en navegador: las hago yo después; repórtalas como
   pendientes. Informa archivos, comandos, resultados, fallos y comprobaciones no
   ejecutadas. No marques el roadmap por mí y detente antes del siguiente
   incremento.
   ```

5. **Revisa el informe del agente.** Antes de comprobar, confirma que muestra:

   - las pruebas fallando (RED) antes de implementar y después en verde;
   - los `message` exactos de la tabla de errores del contrato;
   - que la ruta lee el cuerpo con `c.req.text()`;
   - cambios solo en los archivos de esta ficha y sus pruebas.

6. **Comprueba tú**, desde la raíz:

   ```powershell
   npm.cmd test --workspace api
   npm.cmd run typecheck
   ```

   Ambos deben terminar con `$LASTEXITCODE` igual a `0`. Después, con la API en marcha en su terminal (`npm.cmd run dev:api`; si ya estaba abierta, se recarga sola), ejecuta en otra terminal los comandos siguientes. Las comillas del JSON cambian entre versiones de PowerShell, así que el cuerpo se escribe primero en un archivo temporal y `curl.exe` lo envía tal cual.

   ```powershell
   $body = Join-Path $env:TEMP "partyquest-chat.json"
   [IO.File]::WriteAllText($body, '{"message":"Hola, Pachi"}')
   curl.exe -i -X POST http://127.0.0.1:8787/api/chat -H "Content-Type: application/json" --data-binary "@$body"
   [IO.File]::WriteAllText($body, '{"message":"Hola","history":[]}')
   curl.exe -i -X POST http://127.0.0.1:8787/api/chat -H "Content-Type: application/json" --data-binary "@$body"
   ```

   En macOS/Linux:

   ```bash
   curl -i -X POST http://127.0.0.1:8787/api/chat -H "Content-Type: application/json" -d '{"message":"Hola, Pachi"}'
   curl -i -X POST http://127.0.0.1:8787/api/chat -H "Content-Type: application/json" -d '{"message":"Hola","history":[]}'
   ```

   **Resultado esperado:**

   | Petición | Respuesta |
   | --- | --- |
   | Mensaje válido | `HTTP/1.1 503` con `"code":"configuration_error"` y `"retryable":false` |
   | Mensaje con `history` | `HTTP/1.1 400` con `"code":"invalid_request"` |

   **Lo que puede confundirte:**

   - El `503` es el resultado **correcto** en esta ficha: todavía no hay adaptador de Groq (llega en B2.3), así que la API informa que falta configuración en lugar de inventar una respuesta.
   - En macOS, zsh muestra un `%` al final cuando la respuesta no termina con salto de línea; no forma parte del cuerpo. Si ejecutas dos `curl` seguidos, sus salidas pueden aparecer pegadas.
   - Copia solo los comandos, no el resultado esperado.
   - `Failed to connect` significa que la API no está en marcha en `:8787`.

7. Anota en la tabla de la sección 3 el estado y lo que observaste. Ejemplo de evidencia: «N/N pruebas en verde; typecheck 0; chat válido → 503 `configuration_error`; con `history` → 400 `invalid_request`». Detente aquí: la siguiente ficha empieza con su propio prompt 1.

### D1·B2.3 — Adaptador Groq en el servidor

**Datos de la ficha**

- **Abre:** `api/src/features/chat/infrastructure/groq/groq-text-generation-adapter.ts`
- **También:** `api/src/features/chat/application/pachi-system-instruction.ts`, `api/src/app/create-app.ts`, `api/src/app/server.ts`
- **Pruebas:** `api/src/features/chat/tests/groq-text-generation-adapter.test.ts`
- **Lectura:** [contrato API](../api-contract.md), respuesta exitosa, usage y errores; [E1](../01-chat-integration.md)
- **Preparación manual:** crearás `api/.env` en el paso 7, **después** de comprobar el caso sin configuración. Hazlo tú; no le pidas al agente leer ni mostrar ese archivo.

**Paso a paso**

1. Abre `api/src/features/chat/infrastructure/groq/groq-text-generation-adapter.ts` y lee su `TODO(D1·B2.3)`.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D1·B2.3. Lee AGENTS.md, la ficha de D1·B2.3 en
   docs/day-1/roadmap.md, los TODO(D1·B2.3) de los archivos que indica y sus
   lecturas. Objetivo: Conectar el adaptador de Groq exclusivamente en el servidor,
   con `groq-sdk` ya instalado. Las pruebas usan un `fetch` falso y nunca llaman al
   proveedor. Explica primero cómo se maneja la configuración ausente. Todavía no
   edites ni ejecutes cambios. Explícame el resultado observable, el concepto, los
   archivos que vas a tocar, las pruebas y comprobaciones, y cualquier decisión que
   falte. Para cada decisión, cita el archivo y la línea que la definen, y separa
   lo que ya fijan el contrato, los TODO o las pruebas existentes de lo que
   propones tú. Si una prueba de una ficha anterior ya fija un valor, úsalo. Espera
   mi autorización explícita.
   ```

3. Revisa la respuesta. Debe limitarse a esta ficha, con estos archivos: `groq-text-generation-adapter.ts`, `pachi-system-instruction.ts`, `create-app.ts`, `server.ts`, `groq-text-generation-adapter.test.ts`. Si menciona otro ID o archivos distintos, pídele que se ajuste a la ficha antes de autorizar.

   **Si el agente pregunta…** Estas decisiones ya están resueltas; indícale la fuente:

   - **Texto de `PACHI_SYSTEM_INSTRUCTION`:** ningún documento fija la redacción; la decides tú a partir de la propuesta del agente. Debe decir que Pachi no tiene catálogo, horarios, precios ni ubicación, y que cualquier lugar que mencione es una idea sin verificar. Escríbelo en español neutro, con tuteo. En B4.1 compararás variantes.
   - **Estados de Groq:** tabla «Errores de Groq» del [contrato API](../api-contract.md): 401, 403 y 404 → `configuration`; 429 → `quota`; otros 4xx, 5xx y fallos de red → `provider`.
   - **Sin reintentos:** el SDK reintenta por defecto y D1 no reintenta, así que el cliente se crea con `maxRetries: 0`.
   - **Entorno:** `createApp()` sin argumentos no lee el entorno (`env` vacío por defecto); solo `server.ts` le pasa `process.env`. Así las pruebas existentes no llaman al proveedor aunque haya una clave en la terminal.
4. Copia el **prompt 2 (autorización)**. El agente implementa solo esta ficha.

   ```text
   Autorizo únicamente D1·B2.3 según el alcance que explicaste. Usa los archivos,
   nombres y textos que indican los TODO, la ficha, el contrato y las pruebas ya
   escritas; no elijas otra estructura ni agregues dependencias. Si hay pruebas
   deterministas aplicables, escribe primero la prueba y observa que falle; después
   implementa y mantén las comprobaciones en verde. No resuelvas TODO de otros ID,
   no cambies contratos y no hagas commits ni push. No hagas llamadas reales al
   proveedor ni revisión en navegador: las hago yo después; repórtalas como
   pendientes. Informa archivos, comandos, resultados, fallos y comprobaciones no
   ejecutadas. No marques el roadmap por mí y detente antes del siguiente
   incremento.
   ```

5. **Revisa el informe del agente.** Confirma que muestra:

   - las pruebas fallando (RED) antes de implementar y después en verde;
   - que las pruebas cuentan las llamadas al `fetch` falso: **0** cuando falta configuración y **exactamente 1** con 429, 5xx o error de red (eso demuestra que no hay reintentos);
   - `maxRetries: 0` al crear el cliente y ningún `console.` en el adaptador;
   - que no hizo llamadas reales ni leyó `api/.env`;
   - cambios solo en los archivos de esta ficha y su prueba.

6. **Comprueba tú sin configuración**, desde la raíz:

   ```powershell
   npm.cmd test --workspace api
   npm.cmd run typecheck
   npm.cmd run build
   Get-ChildItem -Recurse -File frontend\dist | Select-String -Pattern "GROQ","gsk_" -List
   ```

   Los tres primeros terminan con `$LASTEXITCODE` igual a `0`; el último **no debe mostrar nada**: ni la clave ni su nombre llegan al bundle del navegador. En macOS/Linux, el último es `grep -rlE "GROQ|gsk_" frontend/dist`.

   Si ya tenías `api/.env`, apártalo un momento con `Rename-Item api\.env .env.off` (macOS/Linux: `mv api/.env api/.env.off`). Detén la API con `Ctrl+C`, vuelve a iniciarla con `npm.cmd run dev:api` y, en otra terminal, envía el mismo mensaje que en B2.2:

   ```powershell
   $body = Join-Path $env:TEMP "partyquest-chat.json"
   [IO.File]::WriteAllText($body, '{"message":"Hola, Pachi"}')
   curl.exe -i -X POST http://127.0.0.1:8787/api/chat -H "Content-Type: application/json" --data-binary "@$body"
   curl.exe -i http://127.0.0.1:8787/api/health
   ```

   Esperado: `HTTP/1.1 503` con `"code":"configuration_error"` y `"retryable":false`, y health `HTTP/1.1 200` con `{"status":"ok"}`. La API arranca y responde aunque falte la clave. En macOS/Linux usa los comandos `curl` de B2.2 y `curl -i http://127.0.0.1:8787/api/health`.

7. **Prepara la configuración.** Si la apartaste, restáurala con `Rename-Item api\.env.off .env` (macOS/Linux: `mv api/.env.off api/.env`). Si aún no existe, créala con `Copy-Item api\.env.example api\.env` (macOS/Linux: `cp api/.env.example api/.env`) y escribe en el editor tu clave y `GROQ_MODEL=openai/gpt-oss-20b`. Comprueba con `git status --short` que `api/.env` **no aparece**: `.gitignore` lo excluye. Reinicia la API para que cargue el archivo.

8. **Llamada real (opcional).** ⚠️ Repetir el `POST` con la API configurada hace una llamada real a Groq y consume tu cuota; hazlo solo si quieres comprobar la conectividad. Esperado: `HTTP/1.1 200` con `reply`, `"model":"openai/gpt-oss-20b"` y `usage`. La respuesta puede mencionar lugares: en D1 son ideas sin verificar, no un error. Anota estado, modelo y si llegó usage, **sin copiar la clave**, y regístralo aparte de las pruebas simuladas.

9. Anota en la tabla de la sección 3 el estado y lo que observaste. Ejemplo de evidencia: «N/N pruebas; typecheck y build 0; bundle sin `GROQ`; sin configuración: chat 503 `configuration_error`, health 200; llamada real: no realizada / 200 con usage». Detente aquí: la siguiente ficha empieza con su propio prompt 1.

### D1·B2.4 — Conectar el envío desde la interfaz

**Datos de la ficha**

- **Abre:** `frontend/src/features/chat/components/ChatPage.tsx`
- **También:** `frontend/src/features/chat/api/chat-client.ts`, `frontend/src/features/chat/model/message-rules.ts`, `frontend/src/features/chat/model/use-chat.ts`, `frontend/src/app/App.tsx`
- **Pruebas:** `frontend/src/features/chat/tests/chat-client.test.ts` y `frontend/src/features/chat/tests/chat-page.test.tsx`
- **Lectura:** [E1](../01-chat-integration.md); [contrato API](../api-contract.md), responsabilidades de la interfaz; [referencia de interfaz](interface-reference.md)
- **Textos:** marcador de posición con conversación vacía «Ej.: el domingo a mediodía, somos 4…» y con mensajes «Escribe un mensaje…»; espera «Revisando opciones…»; aviso bajo el campo «El mensaje supera 2000 caracteres.»

**Paso a paso**

1. Abre `frontend/src/features/chat/components/ChatPage.tsx` y lee su `TODO(D1·B2.4)`.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D1·B2.4. Lee AGENTS.md, la ficha de D1·B2.4 en
   docs/day-1/roadmap.md, los TODO(D1·B2.4) de los archivos que indica y sus
   lecturas. Objetivo: Conectar el formulario al endpoint y mostrar la respuesta
   con los componentes entregados. Se envía solo el mensaje actual: sin historial,
   ubicación ni clave. No agregues todavía errores, usage, ubicación ni reinicio.
   Todavía no edites ni ejecutes cambios. Explícame el resultado observable, el
   concepto, los archivos que vas a tocar, las pruebas y comprobaciones, y
   cualquier decisión que falte. Para cada decisión, cita el archivo y la línea que
   la definen, y separa lo que ya fijan el contrato, los TODO o las pruebas
   existentes de lo que propones tú. Si una prueba de una ficha anterior ya fija un
   valor, úsalo. Espera mi autorización explícita.
   ```

3. Revisa la respuesta. Debe limitarse a esta ficha, con estos archivos: `ChatPage.tsx`, `chat-client.ts`, `message-rules.ts`, `use-chat.ts`, `App.tsx`, `chat-client.test.ts`, `chat-page.test.tsx`. Si menciona otro ID o archivos distintos, pídele que se ajuste a la ficha antes de autorizar.

   **Si el agente pregunta…** Estas decisiones ya están resueltas; indícale la fuente:

   - **Errores antes de B3.1:** una respuesta que no sea 2xx o un fallo de red **nunca** se muestra como respuesta de Pachi. El cliente comprueba `response.ok` y, si no, lanza un error; `useChat` solo apaga la espera. No se inventan `code` ni `retryable`: traducirlos es B3.1. Lo indica el `TODO(D1·B2.4)` de `chat-client.ts`.
   - **Nota del starter:** se quita sin texto de reemplazo; la muestra D1-01 de la referencia de interfaz solo tiene el saludo.
   - **Límite del mensaje:** se cuenta en puntos de código Unicode (`[...texto].length`), no con `.length`. Las pruebas lo fijan con emoji: 2000 se aceptan y 2001 no.
   - **Borrador:** se limpia al enviar.
4. Copia el **prompt 2 (autorización)**. El agente implementa solo esta ficha.

   ```text
   Autorizo únicamente D1·B2.4 según el alcance que explicaste. Usa los archivos,
   nombres y textos que indican los TODO, la ficha, el contrato y las pruebas ya
   escritas; no elijas otra estructura ni agregues dependencias. Si hay pruebas
   deterministas aplicables, escribe primero la prueba y observa que falle; después
   implementa y mantén las comprobaciones en verde. No resuelvas TODO de otros ID,
   no cambies contratos y no hagas commits ni push. No hagas llamadas reales al
   proveedor ni revisión en navegador: las hago yo después; repórtalas como
   pendientes. Informa archivos, comandos, resultados, fallos y comprobaciones no
   ejecutadas. No marques el roadmap por mí y detente antes del siguiente
   incremento.
   ```

5. **Revisa el informe del agente.** Confirma que muestra:

   - las pruebas fallando (RED) antes de implementar y después en verde;
   - que el cliente comprueba `response.ok` y una prueba con un `fetch` falso que responde `503`: no aparece respuesta de Pachi, desaparece «Revisando opciones…» y «Enviar» vuelve a estar disponible;
   - que la prueba de la espera usa una promesa que no se resuelve de inmediato: si el doble responde al instante, «Revisando opciones…» no llega a verse;
   - que las pruebas comprueban el cuerpo exacto `{ "message": "…" }` y que un segundo mensaje se envía sin el primero;
   - cambios solo en los siete archivos de esta ficha, usando los componentes entregados (`MessageList`, `Composer`, `TopBar`) sin modificarlos.

6. **Comprueba las pruebas**, desde la raíz:

   ```powershell
   npm.cmd test --workspace frontend
   npm.cmd run typecheck
   ```

   Ambos deben terminar con `$LASTEXITCODE` igual a `0`. En macOS/Linux usa `npm` en lugar de `npm.cmd`.

7. **Comprueba en el navegador.** Con `dev:frontend` y `dev:api` en marcha, abre **http://127.0.0.1:5173** y las herramientas de desarrollo (`F12`). Activa el modo de dispositivos para el ancho de 360 px y abre la pestaña **Red** (Network) filtrada por `chat`. Revisa cada fila en los dos anchos:

   | Qué revisar | 360 px | Escritorio |
   | --- | --- | --- |
   | Sin conversación: saludo «¿Qué se arma hoy?», marcador «Ej.: el domingo a mediodía, somos 4…» y «Enviar» deshabilitado | ☐ | ☐ |
   | Al enviar: tu burbuja, «Revisando opciones…» y Pachi con expresión de espera | ☐ | ☐ |
   | Llega la respuesta de Pachi y el marcador cambia a «Escribe un mensaje…» | ☐ | ☐ |
   | En **Red**, el cuerpo de `POST /api/chat` es solo `{"message":"…"}` | ☐ | ☐ |
   | Con más de 2000 caracteres, el aviso «El mensaje supera 2000 caracteres.» aparece **bajo el campo**, no en la fila del botón, y «Enviar» se deshabilita | ☐ | ☐ |
   | Sin desplazamiento horizontal; un texto largo sin espacios hace salto de línea dentro de la burbuja | ☐ | ☐ |
   | Con varios mensajes, la lista se desplaza y el campo sigue visible abajo | ☐ | ☐ |

   Para probar el límite, escribe en la consola del navegador `copy("a".repeat(2001))` y pega el texto en el campo.

   **Lo que puede confundirte:**

   - **Con `api/.env`**, cada envío es una llamada real a Groq y consume tu cuota: uno o dos mensajes bastan. La respuesta puede mencionar lugares; en D1 son ideas sin verificar.
   - **Sin `api/.env`**, ves tu burbuja y la espera, y después **ninguna respuesta ni aviso**: la API responde `503` y el aviso de error llega en B3.1. Es el comportamiento esperado en esta ficha, no un fallo.
   - Las pruebas simuladas no sustituyen esta revisión: comprueban el comportamiento, no cómo se ve.

8. Anota en la tabla de la sección 3 el estado y lo que observaste. Si hiciste llamadas reales, anota cuántas y con qué modelo, aparte de las pruebas simuladas. Ejemplo de evidencia: «N/N pruebas; typecheck 0; navegador 360 px y escritorio: estados correctos; Red: solo `message`; 1 llamada real, 200». Detente aquí: la siguiente ficha empieza con su propio prompt 1.

### D1·B3.1 — Error recuperable y cuota agotada

**Datos de la ficha**

- **Abre:** `frontend/src/features/chat/api/chat-client.ts`
- **También:** `frontend/src/features/chat/model/use-chat.ts`, `frontend/src/features/chat/components/ChatPage.tsx` (usa `InlineNotice`)
- **Pruebas:** las de B2.4, ampliadas
- **Lectura:** [contrato API](../api-contract.md), errores; [referencia de interfaz](interface-reference.md)
- **Textos:** cuota agotada: título «Se alcanzó el límite de uso», cuerpo «Por ahora no puedo responder. Tu conversación sigue visible en esta página.», sin acciones. Otros fallos: título «No pude obtener respuesta», cuerpo «Tu conversación sigue visible en esta página.», acción «Editar mensaje» y, solo si el error es reintentable, «Reintentar».

**Paso a paso**

1. Abre `frontend/src/features/chat/api/chat-client.ts` y lee su `TODO(D1·B3.1)`.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D1·B3.1. Lee AGENTS.md, la ficha de D1·B3.1 en
   docs/day-1/roadmap.md, los TODO(D1·B3.1) de los archivos que indica y sus
   lecturas. Objetivo: Representar solo los errores de red o contrato y la cuota
   agotada. Las pruebas usan respuestas falsas; no provoques errores reales de
   cuota ni reintentes automáticamente. Todavía no edites ni ejecutes cambios.
   Explícame el resultado observable, el concepto, los archivos que vas a tocar,
   las pruebas y comprobaciones, y cualquier decisión que falte. Para cada
   decisión, cita el archivo y la línea que la definen, y separa lo que ya fijan el
   contrato, los TODO o las pruebas existentes de lo que propones tú. Si una prueba
   de una ficha anterior ya fija un valor, úsalo. Espera mi autorización explícita.
   ```

3. Revisa la respuesta. Debe limitarse a esta ficha, con estos archivos: `chat-client.ts`, `use-chat.ts`, `ChatPage.tsx`. Si menciona otro ID o archivos distintos, pídele que se ajuste a la ficha antes de autorizar.

   Las pruebas de B2.4 (`chat-client.test.ts` y `chat-page.test.tsx`) se amplían; no hace falta modificar `MessageList.tsx`, porque ya acepta el aviso como contenido (`children`).

   **Si el agente pregunta…** Estas decisiones ya están resueltas; indícale la fuente:

   - **Fallo de red o respuesta inválida:** el contrato no les asigna código, así que el cliente usa `code: "provider_error"` y `retryable: true`, y distingue el origen con `source` (`"network"` o `"invalid_response"`), que ya existe en `ChatClientResult`. No se inventan códigos nuevos. Lo indica el `TODO(D1·B3.1)` de `chat-client.ts`.
   - **El cliente ya no lanza errores:** toda respuesta se traduce a un resultado. La prueba de B2.4 que esperaba el error (`rejects.toThrow()`) se reemplaza a propósito.
   - **Cuota agotada:** se reconoce por `code: "quota_exceeded"`, nunca por el estado HTTP.
   - **«Editar mensaje»:** quita el aviso y la burbuja del mensaje fallido, devuelve su texto al campo y deja el foco ahí.
   - **«Reintentar»:** reenvía el mismo mensaje sin duplicar su burbuja y **quita el aviso al empezar**; si vuelve a fallar, aparece el aviso nuevo. Nunca se ven a la vez el aviso y «Revisando opciones…».
   - **Enviar con un aviso visible:** el aviso se quita al enviar el mensaje nuevo.
   - **Expresión de Pachi:** «pensando» mientras hay una petición en curso; «apenado» mientras hay un aviso visible. La espera manda sobre la disculpa.
   - **Botones del aviso:** primero «Editar mensaje» (secundario) y después «Reintentar» (principal, `primary: true` en `InlineNotice`).
4. Copia el **prompt 2 (autorización)**. El agente implementa solo esta ficha.

   ```text
   Autorizo únicamente D1·B3.1 según el alcance que explicaste. Usa los archivos,
   nombres y textos que indican los TODO, la ficha, el contrato y las pruebas ya
   escritas; no elijas otra estructura ni agregues dependencias. Si hay pruebas
   deterministas aplicables, escribe primero la prueba y observa que falle; después
   implementa y mantén las comprobaciones en verde. No resuelvas TODO de otros ID,
   no cambies contratos y no hagas commits ni push. No hagas llamadas reales al
   proveedor ni revisión en navegador: las hago yo después; repórtalas como
   pendientes. Informa archivos, comandos, resultados, fallos y comprobaciones no
   ejecutadas. No marques el roadmap por mí y detente antes del siguiente
   incremento.
   ```

5. **Revisa el informe del agente.** Confirma que muestra:

   - las pruebas nuevas fallando (RED) antes de implementar y después en verde;
   - pruebas del cliente para 429, 502, 503, fallo de red, respuesta 200 con cuerpo inválido y error que no es JSON, y que en cada caso `fetch` se llama **una sola vez** (sin reintentos automáticos);
   - pruebas de la página para la cuota (sin botones), un error no reintentable (solo «Editar mensaje») y uno reintentable (los dos botones);
   - una prueba de que durante «Reintentar» se ve «Revisando opciones…» y no el aviso, y otra de que enviar un mensaje nuevo quita el aviso;
   - cambios solo en los archivos de esta ficha y sus pruebas.

6. **Comprueba las pruebas**, desde la raíz:

   ```powershell
   npm.cmd test
   npm.cmd run typecheck
   ```

   Ambos deben terminar con `$LASTEXITCODE` igual a `0`; `npm.cmd test` corre las pruebas de la API y del frontend. En macOS/Linux usa `npm` en lugar de `npm.cmd`.

7. **Comprueba en el navegador**, a 360 px y en escritorio, provocando cada caso así:

   | Caso | Cómo provocarlo | Qué debes ver |
   | --- | --- | --- |
   | Error no reintentable | Aparta `api/.env` (`Rename-Item api\.env .env.off`), reinicia la API y envía un mensaje | «No pude obtener respuesta» con solo «Editar mensaje»; Pachi apenado |
   | «Editar mensaje» | Púlsalo en el caso anterior | Desaparecen el aviso y tu burbuja; el texto vuelve al campo con el foco |
   | Enviar con aviso visible | Con el aviso en pantalla, envía otro mensaje | El aviso anterior desaparece al enviar; se ve «Revisando opciones…» y, como la configuración sigue apartada, después un aviso nuevo para ese mensaje |
   | Error reintentable | Restaura `api/.env` (`Rename-Item api\.env.off .env`), detén la API con `Ctrl+C` y envía un mensaje | «Editar mensaje» y «Reintentar», este como botón principal |
   | «Reintentar» | Inicia la API de nuevo y pulsa «Reintentar». ⚠️ Es una llamada real a Groq | El aviso desaparece, se ve «Revisando opciones…» y llega la respuesta sin duplicar tu burbuja |
   | Cuota agotada | No se puede provocar con seguridad | Solo la cubren las pruebas; anótalo así |
   | Diseño a 360 px | Cualquiera de los avisos | El aviso queda dentro de la conversación; los botones caben o bajan de línea sin desbordar |

   En macOS/Linux, aparta y restaura la configuración con `mv api/.env api/.env.off` y `mv api/.env.off api/.env`.

   **Lo que puede confundirte:**

   - Con la API detenida, el proxy del frontend responde con un error que no sigue el contrato. El cliente lo trata como respuesta inválida reintentable, así que **debe** aparecer «Reintentar».
   - Tras «Editar mensaje», tu burbuja desaparece **a propósito**: el texto vuelve al campo para que lo corrijas y lo envíes de nuevo.
   - La prueba de B2.4 que esperaba que el cliente lanzara un error cambia en esta ficha: no es una regresión.

8. Anota en la tabla de la sección 3 el estado y lo que observaste. Ejemplo de evidencia: «N/N pruebas; typecheck 0; navegador 360 px y escritorio: no reintentable, editar, reintentable y reintentar correctos; cuota: solo pruebas; 1 llamada real, 200». Detente aquí: la siguiente ficha empieza con su propio prompt 1.

### D1·B3.2 — Usage y costo teórico

**Datos de la ficha**

- **Abre:** `frontend/src/features/chat/model/session-usage.ts`
- **También:** `frontend/src/features/chat/model/use-chat.ts`, `frontend/src/features/chat/components/ChatPage.tsx` (usa `UsagePanel`)
- **Pruebas:** `frontend/src/features/chat/tests/session-usage.test.ts` y la ampliación de `chat-page.test.tsx`
- **Lectura:** [contrato API](../api-contract.md), usage y costo; sección 6 de este roadmap

**Paso a paso**

1. Abre `frontend/src/features/chat/model/session-usage.ts` y lee su `TODO(D1·B3.2)`.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D1·B3.2. Lee AGENTS.md, la ficha de D1·B3.2 en
   docs/day-1/roadmap.md, los TODO(D1·B3.2) de los archivos que indica y sus
   lecturas. Objetivo: Mostrar y acumular usage y costo según el contrato. Prueba
   usage completo, parcial y ausente. Una respuesta válida no se pierde si falta
   usage y un campo desconocido no se convierte en cero. Todavía no edites ni
   ejecutes cambios. Explícame el resultado observable, el concepto, los archivos
   que vas a tocar, las pruebas y comprobaciones, y cualquier decisión que falte.
   Para cada decisión, cita el archivo y la línea que la definen, y separa lo que
   ya fijan el contrato, los TODO o las pruebas existentes de lo que propones tú.
   Si una prueba de una ficha anterior ya fija un valor, úsalo. Espera mi
   autorización explícita.
   ```

3. Revisa la respuesta. Debe limitarse a esta ficha, con estos archivos: `session-usage.ts`, `use-chat.ts`, `ChatPage.tsx`, `session-usage.test.ts` y `chat-page.test.tsx`. Si menciona otro ID o archivos distintos, pídele que se ajuste a la ficha antes de autorizar.

   **Si el agente pregunta…** Estas decisiones ya están resueltas en los `TODO(D1·B3.2)`; indícale la fuente:

   - **Antes de la primera respuesta** no hay consumo (`null`) y no se muestra `UsagePanel`. Desde la primera respuesta, el panel aparece siempre encima del campo, aunque esa respuesta no traiga usage.
   - **Estado del consumo:** `"unavailable"` si ninguna respuesta de la conversación trajo usage; `"incomplete"` si alguna lo trajo, pero falta al menos un campo en alguna respuesta (incluida una respuesta sin usage); `"complete"` si todas las respuestas trajeron los tres campos.
   - **Campos:** se suman respuesta por respuesta. Un campo que falta en cualquier respuesta queda `null` para toda la conversación: nunca se cuenta como cero ni se calcula a partir de los otros.
   - **Costo:** se calcula por respuesta con la tarifa de **su** modelo en `MODEL_RATES` (entrada y salida, en USD por millón de tokens) y se acumula. Existe solo si el estado es `"complete"` y todas las respuestas usaron un modelo con tarifa; si no, es `null` y el panel muestra «Costo teórico: no disponible».
   - **Entrada en caché:** la sección 6 menciona su tarifa, pero el usage del contrato no informa tokens en caché, así que la estimación usa solo la tarifa estándar de entrada y salida.
   - **Modelo del panel:** el de la última respuesta. Un fallo no cambia el consumo acumulado.
   - **Textos del panel:** ya están en `UsagePanel.tsx` («Consumo de esta conversación», «Consumo incompleto», «No se recibió todo el usage.», «Sin datos de usage: no disponible.»). No se modifican.
4. Copia el **prompt 2 (autorización)**. El agente implementa solo esta ficha.

   ```text
   Autorizo únicamente D1·B3.2 según el alcance que explicaste. Usa los archivos,
   nombres y textos que indican los TODO, la ficha, el contrato y las pruebas ya
   escritas; no elijas otra estructura ni agregues dependencias. Si hay pruebas
   deterministas aplicables, escribe primero la prueba y observa que falle; después
   implementa y mantén las comprobaciones en verde. No resuelvas TODO de otros ID,
   no cambies contratos y no hagas commits ni push. No hagas llamadas reales al
   proveedor ni revisión en navegador: las hago yo después; repórtalas como
   pendientes. Informa archivos, comandos, resultados, fallos y comprobaciones no
   ejecutadas. No marques el roadmap por mí y detente antes del siguiente
   incremento.
   ```

5. **Revisa el informe del agente.** Confirma que muestra:

   - las pruebas fallando (RED) antes de implementar y después en verde;
   - pruebas de `addUsage` para usage completo, parcial y ausente, para dos respuestas seguidas (suma) y para una respuesta sin usage después de una completa (el estado pasa a `"incomplete"` y los campos quedan `null`);
   - una prueba del costo con valores concretos calculados a mano con la tarifa de `model-rates.ts`, y otra de un modelo sin tarifa (costo `null`);
   - una prueba de la página: con un cliente falso, el panel aparece tras la primera respuesta y muestra «no disponible» cuando falta usage;
   - cambios solo en los archivos de esta ficha y su prueba; `UsagePanel.tsx` y `model-rates.ts` sin modificar.

6. **Comprueba las pruebas**, desde la raíz:

   ```powershell
   npm.cmd test
   npm.cmd run typecheck
   ```

   Ambos deben terminar con `$LASTEXITCODE` igual a `0`. En macOS/Linux usa `npm` en lugar de `npm.cmd`.

7. **Comprueba en el navegador**, a 360 px y en escritorio:

   | Caso | Cómo provocarlo | Qué debes ver |
   | --- | --- | --- |
   | Sin conversación | Abre la página | No hay panel de consumo |
   | Usage completo | Con `api/.env`, envía un mensaje. ⚠️ Es una llamada real | Encima del campo, «Consumo de esta conversación» con entrada, salida, total y «Costo teórico: US$…» con la fecha de la tarifa |
   | Acumulado | Envía un segundo mensaje. ⚠️ Otra llamada real | Los tokens y el costo aumentan; no se reinician |
   | Usage parcial o ausente | No se puede provocar con Groq | Solo lo cubren las pruebas; anótalo así |
   | Diseño a 360 px | Con el panel visible | El panel no tapa el campo ni provoca desplazamiento horizontal |

   **Lo que puede confundirte:**

   - El costo se muestra con seis decimales y es una estimación, no una factura. Si todas las respuestas usaron `openai/gpt-oss-20b`, puedes comprobarlo con los totales del panel: (entrada × 0.075 + salida × 0.30) / 1 000 000 USD. Si cambió el modelo, calcula el costo por respuesta con su propia tarifa y suma los resultados.
   - Si apartaste `api/.env`, la respuesta falla y el consumo no cambia: es lo esperado.
   - El panel se reinicia con «Nuevo plan» hasta B6.2; por ahora, recargar la página lo limpia porque nada se guarda.

8. Anota en la tabla de la sección 3 el estado y lo que observaste. Ejemplo de evidencia: «N/N pruebas; typecheck 0; navegador: panel completo con costo y acumulado tras 2 llamadas reales; parcial y ausente: solo pruebas». Detente aquí: la siguiente ficha empieza con su propio prompt 1.

### D1·B4.1 — Comparar instrucciones de sistema

**Datos de la ficha**

- **Abre:** `api/src/features/chat/application/pachi-system-instruction.ts`
- **Lectura:** [E1](../01-chat-integration.md)

**Paso a paso**

1. Abre `api/src/features/chat/application/pachi-system-instruction.ts` y lee su `TODO(D1·B4.1)`.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D1·B4.1. Lee AGENTS.md, la ficha de D1·B4.1 en
   docs/day-1/roadmap.md, los TODO(D1·B4.1) de los archivos que indica y sus
   lecturas. Objetivo: Preparar una comparación controlada de instrucciones de
   sistema con el mismo mensaje de usuario. No modifiques el contrato ni presentes
   una salida convincente como verificación de hechos. Explica qué evidencia
   registrar. Todavía no edites ni ejecutes cambios. Explícame el resultado
   observable, el concepto, los archivos que vas a tocar, las pruebas y
   comprobaciones, y cualquier decisión que falte. Para cada decisión, cita el
   archivo y la línea que la definen, y separa lo que ya fijan el contrato, los
   TODO o las pruebas existentes de lo que propones tú. Si una prueba de una ficha
   anterior ya fija un valor, úsalo. Espera mi autorización explícita.
   ```

3. Revisa la respuesta. Debe limitarse a esta ficha, con estos archivos: `pachi-system-instruction.ts`. Si menciona otro ID o archivos distintos, pídele que se ajuste a la ficha antes de autorizar.

   **Protocolo de la comparación** (ya decidido; si el agente pregunta, indícale esta ficha):

   - **Dos variantes:** **A** es la instrucción actual de B2.3; **B** cambia **una sola cosa** respecto de A, por ejemplo pedir que Pachi haga una sola pregunta cuando falte información. Así la diferencia observada tiene una causa clara.
   - **Mismo mensaje para ambas:** «¿A dónde podemos ir el domingo a mediodía? Somos 4 y no queremos gastar mucho.»
   - **Quién hace las llamadas:** tú, no el agente. El agente solo redacta la variante B y deja en el archivo cómo alternar entre A y B. Con la API en marcha (`npm.cmd run dev:api`), al cambiar la instrucción la API se recarga sola.
   - **Tope:** una llamada por variante; como máximo, dos por variante si quieres ver cuánto cambia la respuesta con la misma instrucción.
   - **Qué observar:** si aclara que los lugares son ideas sin verificar, si inventa horarios o precios, si hace preguntas, el tono y la longitud. **No** juzgues si los lugares existen: el modelo no comprueba hechos.
   - **Al terminar:** el archivo queda con la variante que elijas, y esa variante debe seguir diciendo que Pachi no tiene catálogo, horarios, precios ni ubicación. Las pruebas existentes no cambian.
4. Copia el **prompt 2 (autorización)**. El agente implementa solo esta ficha.

   ```text
   Autorizo únicamente D1·B4.1 según el alcance que explicaste. Usa los archivos,
   nombres y textos que indican los TODO, la ficha, el contrato y las pruebas ya
   escritas; no elijas otra estructura ni agregues dependencias. Si hay pruebas
   deterministas aplicables, escribe primero la prueba y observa que falle; después
   implementa y mantén las comprobaciones en verde. No resuelvas TODO de otros ID,
   no cambies contratos y no hagas commits ni push. No hagas llamadas reales al
   proveedor ni revisión en navegador: las hago yo después; repórtalas como
   pendientes. Informa archivos, comandos, resultados, fallos y comprobaciones no
   ejecutadas. No marques el roadmap por mí y detente antes del siguiente
   incremento.
   ```

5. **Revisa el informe del agente.** Confirma que solo cambió `pachi-system-instruction.ts`, que no hizo llamadas reales y que la variante B difiere de A en un solo aspecto.

6. **Haz la comparación tú.** Con `api/.env` y la API en marcha, deja activa la variante A, envía el mensaje del protocolo desde la interfaz y copia la respuesta. Cambia a la variante B, espera a que la API se recargue y repite. ⚠️ Cada envío es una llamada real a Groq.

7. **Registra la evidencia** en tus notas con esta tabla:

   | Variante | Instrucción (texto completo) | Mensaje | Respuesta | Observación |
   | --- | --- | --- | --- | --- |
   | A | … | «¿A dónde podemos ir el domingo a mediodía? Somos 4 y no queremos gastar mucho.» | … | … |
   | B | … | (el mismo) | … | … |

   Después, comprueba que todo sigue en verde con `npm.cmd test` y `npm.cmd run typecheck` (en macOS/Linux, `npm`).

   **Lo que puede confundirte:**

   - El modelo no responde igual dos veces, ni siquiera con la misma instrucción: una sola llamada por variante muestra una tendencia, no una prueba.
   - Una respuesta convincente no verifica nada: los lugares que mencione siguen siendo ideas sin verificar.
   - Sin clave no hay comparación: marca la ficha como **bloqueada** y anota que falta la observación.

8. Anota en la tabla de la sección 3 el estado, qué variante quedó y por qué. Ejemplo de evidencia: «2 variantes, 2 llamadas reales; tabla registrada; quedó B porque pregunta por el presupuesto antes de sugerir; pruebas y typecheck 0». Detente aquí: la siguiente ficha empieza con su propio prompt 1.

### D1·B5.1 — Completar las pruebas del contrato

**Datos de la ficha**

- **Abre:** [contrato API](../api-contract.md), sección de comprobaciones de aceptación
- **Pruebas:** las carpetas `tests/` ya creadas en `api/` y `frontend/`

**Paso a paso**

1. Abre el [contrato API](../api-contract.md) en la sección de comprobaciones de aceptación y repasa los requisitos que deben quedar cubiertos.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D1·B5.1. Lee AGENTS.md, la ficha de D1·B5.1 en
   docs/day-1/roadmap.md, los TODO(D1·B5.1) de los archivos que indica y sus
   lecturas. Objetivo: Completar únicamente la cobertura determinista que deriva
   del contrato y revisar las regresiones de lo ya construido. No agregues
   capacidades. Enumera requisito por requisito la evidencia que falta antes de
   editar. Todavía no edites ni ejecutes cambios. Explícame el resultado
   observable, el concepto, los archivos que vas a tocar, las pruebas y
   comprobaciones, y cualquier decisión que falte. Para cada decisión, cita el
   archivo y la línea que la definen, y separa lo que ya fijan el contrato, los
   TODO o las pruebas existentes de lo que propones tú. Si una prueba de una ficha
   anterior ya fija un valor, úsalo. Espera mi autorización explícita.
   ```

3. Revisa la respuesta. Debe limitarse a esta ficha: solo archivos de pruebas en las carpetas `tests/` de `api/` y `frontend/`. Esta ficha no tiene `TODO`: la guía es la sección de comprobaciones de aceptación del contrato. Si menciona otro ID o archivos distintos, pídele que se ajuste a la ficha antes de autorizar.

   El agente debe presentar, **antes de editar**, este mapa con la prueba que ya cubre cada comprobación o «falta»:

   | # | Comprobación del contrato | Dónde suele estar cubierta |
   | --- | --- | --- |
   | 1 | `GET /api/health` responde 200 sin clave y no llama a Groq | Puede faltar: el starter no trae prueba de health |
   | 2 | Solicitud válida → `reply`, `model` y usage; una sola llamada con el mensaje de sistema y el mensaje actual recortado | B2.1/B2.2 (ruta) y B2.3 (adaptador) |
   | 3 | Campos extra, JSON inválido, mensaje no textual, vacío o largo → `400 invalid_request` sin llamar a Groq; 2000 sí, 2001 no | B2.2 |
   | 4 | La validación ocurre antes de comprobar la configuración | B2.2 |
   | 5 | Falta `GROQ_API_KEY` o `GROQ_MODEL` → `503 configuration_error` sin llamar a Groq | B2.2 (ruta) y B2.3 (adaptador) |
   | 6 | 429 de Groq → `429 quota_exceeded`; fallo del proveedor o de red → `502 provider_error` | B2.3 (adaptador); puede faltar el recorrido HTTP completo |
   | 7 | Usage ausente o parcial no elimina la respuesta ni se convierte en cero | B2.3 (adaptador) y B3.2 (interfaz) |
   | 8 | Una clave de prueba nunca aparece en cuerpos de respuesta ni en mensajes de error | B2.3 (resultado del adaptador); puede faltar en la respuesta HTTP |

   **Si el agente pregunta…** Estas decisiones ya están resueltas:

   - **Dónde van las pruebas que faltan:** en `api/src/features/chat/tests/chat-http.test.ts` (o un archivo nuevo en esa carpeta para health), por la interfaz HTTP pública: `createApp({ env, fetch })` con una clave y un modelo de prueba y un `fetch` falso. Así recorren la ruta, el caso de uso y el adaptador real sin llamar a Groq.
   - **Sin cambios de comportamiento:** esta ficha solo agrega pruebas. Si una prueba nueva falla porque el código no cumple el contrato, el agente **se detiene y te lo informa**; la corrección se autoriza aparte.
   - **Sin duplicar:** si una comprobación ya está cubierta, se cita la prueba existente y no se escribe otra.
4. Copia el **prompt 2 (autorización)**. El agente implementa solo esta ficha.

   ```text
   Autorizo únicamente D1·B5.1 según el alcance que explicaste. Usa los archivos,
   nombres y textos que indican los TODO, la ficha, el contrato y las pruebas ya
   escritas; no elijas otra estructura ni agregues dependencias. Si hay pruebas
   deterministas aplicables, escribe primero la prueba y observa que falle; después
   implementa y mantén las comprobaciones en verde. No resuelvas TODO de otros ID,
   no cambies contratos y no hagas commits ni push. No hagas llamadas reales al
   proveedor ni revisión en navegador: las hago yo después; repórtalas como
   pendientes. Informa archivos, comandos, resultados, fallos y comprobaciones no
   ejecutadas. No marques el roadmap por mí y detente antes del siguiente
   incremento.
   ```

5. **Revisa el informe del agente.** Confirma que muestra:

   - el mapa completo de las 8 comprobaciones, con el archivo y el nombre de la prueba que cubre cada una;
   - las pruebas nuevas fallando (RED) solo si cubren algo que no estaba probado; si el código ya cumplía, la prueba nueva pasa desde el principio y el agente lo dice;
   - que no cambió código de producción y que ninguna prueba llama a Groq;
   - una nota de lo que estas pruebas **no** demuestran: la conectividad real con Groq, la validez de una clave real ni la calidad de las respuestas.

6. **Comprueba las pruebas**, desde la raíz:

   ```powershell
   npm.cmd test
   npm.cmd run typecheck
   ```

   Ambos deben terminar con `$LASTEXITCODE` igual a `0`. En macOS/Linux usa `npm` en lugar de `npm.cmd`. Esta ficha no necesita revisión en el navegador.

7. Anota en la tabla de la sección 3 el estado, el mapa resumido y la nota de lo que no demuestran. Ejemplo de evidencia: «8/8 comprobaciones cubiertas (3 pruebas nuevas: health, 429 HTTP, clave ausente en el cuerpo); N/N pruebas; typecheck 0; no demuestran conectividad real». Detente aquí: la siguiente ficha empieza con su propio prompt 1.

### D1·B6.1 — Ubicación con permiso o zona escrita

**Datos de la ficha**

- **Abre:** `frontend/src/features/location/model/use-location.ts`
- **También:** `frontend/src/features/chat/components/ChatPage.tsx` (usa `LocationPrompt`), `frontend/src/app/App.tsx`
- **Pruebas:** `frontend/src/features/location/tests/location.test.tsx`, con una geolocalización falsa en `frontend/src/test/fake-geolocation.ts`
- **Lectura:** [E1](../01-chat-integration.md); [referencia de interfaz](interface-reference.md)
- **Textos:** al escribir la zona, el campo usa la etiqueta «Zona de referencia», el marcador «O escribe una zona, por ejemplo «centro»…» y el botón «Guardar zona». Los demás textos ya están en `LocationPrompt`.

**Paso a paso**

1. Abre `frontend/src/features/location/model/use-location.ts` y lee su `TODO(D1·B6.1)`.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D1·B6.1. Lee AGENTS.md, la ficha de D1·B6.1 en
   docs/day-1/roadmap.md, los TODO(D1·B6.1) de los archivos que indica y sus
   lecturas. Objetivo: Implementar ubicación con permiso o zona escrita, guardada
   solo en el navegador. No se envía al endpoint ni al prompt. Prueba permiso
   concedido, denegado y no disponible con una API falsa. Todavía no edites ni
   ejecutes cambios. Explícame el resultado observable, el concepto, los archivos
   que vas a tocar, las pruebas y comprobaciones, y cualquier decisión que falte.
   Para cada decisión, cita el archivo y la línea que la definen, y separa lo que
   ya fijan el contrato, los TODO o las pruebas existentes de lo que propones tú.
   Si una prueba de una ficha anterior ya fija un valor, úsalo. Espera mi
   autorización explícita.
   ```

3. Revisa la respuesta. Debe limitarse a esta ficha, con estos archivos: `use-location.ts`, `ChatPage.tsx`, `App.tsx`, `location.test.tsx`, `fake-geolocation.ts`. Si menciona otro ID o archivos distintos, pídele que se ajuste a la ficha antes de autorizar.
4. Copia el **prompt 2 (autorización)**. El agente implementa solo esta ficha.

   ```text
   Autorizo únicamente D1·B6.1 según el alcance que explicaste. Usa los archivos,
   nombres y textos que indican los TODO, la ficha, el contrato y las pruebas ya
   escritas; no elijas otra estructura ni agregues dependencias. Si hay pruebas
   deterministas aplicables, escribe primero la prueba y observa que falle; después
   implementa y mantén las comprobaciones en verde. No resuelvas TODO de otros ID,
   no cambies contratos y no hagas commits ni push. No hagas llamadas reales al
   proveedor ni revisión en navegador: las hago yo después; repórtalas como
   pendientes. Informa archivos, comandos, resultados, fallos y comprobaciones no
   ejecutadas. No marques el roadmap por mí y detente antes del siguiente
   incremento.
   ```

5. Comprueba: pruebas en verde; en el navegador, la pestaña de red confirma que la petición sigue teniendo solo `message`.
6. Anota en la tabla de la sección 3 el estado y lo que observaste. Detente aquí: la siguiente ficha empieza con su propio prompt 1.

### D1·B6.2 — Confirmar «Nuevo plan»

**Datos de la ficha**

- **Abre:** `frontend/src/features/chat/components/ChatPage.tsx` (usa `ConfirmDialog`)
- **También:** `frontend/src/features/chat/model/use-chat.ts`
- **Pruebas:** `frontend/src/features/chat/tests/chat-page.test.tsx`, ampliada
- **Lectura:** [E1](../01-chat-integration.md); [referencia de interfaz](interface-reference.md)
- **Textos:** título «¿Empezar otra conversación?», descripción «Esta se borrará.», botones «Cancelar» y «Empezar otra conversación». Sin mensajes no se pide confirmación.

**Paso a paso**

1. Abre `frontend/src/features/chat/components/ChatPage.tsx` (usa `ConfirmDialog`) y lee su `TODO(D1·B6.2)`.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D1·B6.2. Lee AGENTS.md, la ficha de D1·B6.2 en
   docs/day-1/roadmap.md, los TODO(D1·B6.2) de los archivos que indica y sus
   lecturas. Objetivo: Implementar solo confirmar o cancelar «Nuevo plan».
   Confirmar limpia intercambios, ubicación o zona y usage de esta sesión; no
   cambia permisos, cuota ni tema, y nada persiste al recargar. Todavía no edites
   ni ejecutes cambios. Explícame el resultado observable, el concepto, los
   archivos que vas a tocar, las pruebas y comprobaciones, y cualquier decisión que
   falte. Para cada decisión, cita el archivo y la línea que la definen, y separa
   lo que ya fijan el contrato, los TODO o las pruebas existentes de lo que
   propones tú. Si una prueba de una ficha anterior ya fija un valor, úsalo. Espera
   mi autorización explícita.
   ```

3. Revisa la respuesta. Debe limitarse a esta ficha, con estos archivos: `ChatPage.tsx`, `use-chat.ts`, `chat-page.test.tsx`. Si menciona otro ID o archivos distintos, pídele que se ajuste a la ficha antes de autorizar.
4. Copia el **prompt 2 (autorización)**. El agente implementa solo esta ficha.

   ```text
   Autorizo únicamente D1·B6.2 según el alcance que explicaste. Usa los archivos,
   nombres y textos que indican los TODO, la ficha, el contrato y las pruebas ya
   escritas; no elijas otra estructura ni agregues dependencias. Si hay pruebas
   deterministas aplicables, escribe primero la prueba y observa que falle; después
   implementa y mantén las comprobaciones en verde. No resuelvas TODO de otros ID,
   no cambies contratos y no hagas commits ni push. No hagas llamadas reales al
   proveedor ni revisión en navegador: las hago yo después; repórtalas como
   pendientes. Informa archivos, comandos, resultados, fallos y comprobaciones no
   ejecutadas. No marques el roadmap por mí y detente antes del siguiente
   incremento.
   ```

5. Comprueba: pruebas en verde; revisión en navegador de cancelar y confirmar.
6. Anota en la tabla de la sección 3 el estado y lo que observaste. Detente aquí: la siguiente ficha empieza con su propio prompt 1.

### D1·B6.3 — Cierre local

**Paso a paso**

1. Revisa en la tabla de la sección 3 que todas las fichas anteriores estén cerradas.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D1·B6.3. Lee AGENTS.md, la ficha de D1·B6.3 en
   docs/day-1/roadmap.md, los TODO(D1·B6.3) de los archivos que indica y sus
   lecturas. Objetivo: Cerrar las comprobaciones locales de D1 sin ampliar el
   alcance. Separa pruebas deterministas, arranque y health, build y llamada real.
   No afirmes una llamada real que no se autorizó ni se observó. Todavía no edites
   ni ejecutes cambios. Explícame el resultado observable, el concepto, los
   archivos que vas a tocar, las pruebas y comprobaciones, y cualquier decisión que
   falte. Para cada decisión, cita el archivo y la línea que la definen, y separa
   lo que ya fijan el contrato, los TODO o las pruebas existentes de lo que
   propones tú. Si una prueba de una ficha anterior ya fija un valor, úsalo. Espera
   mi autorización explícita.
   ```

3. Revisa la respuesta. Debe limitarse a esta ficha. Si menciona otro ID o archivos distintos, pídele que se ajuste a la ficha antes de autorizar.
4. Copia el **prompt 2 (autorización)**. El agente implementa solo esta ficha.

   ```text
   Autorizo únicamente D1·B6.3 según el alcance que explicaste. Usa los archivos,
   nombres y textos que indican los TODO, la ficha, el contrato y las pruebas ya
   escritas; no elijas otra estructura ni agregues dependencias. Si hay pruebas
   deterministas aplicables, escribe primero la prueba y observa que falle; después
   implementa y mantén las comprobaciones en verde. No resuelvas TODO de otros ID,
   no cambies contratos y no hagas commits ni push. No hagas llamadas reales al
   proveedor ni revisión en navegador: las hago yo después; repórtalas como
   pendientes. Informa archivos, comandos, resultados, fallos y comprobaciones no
   ejecutadas. No marques el roadmap por mí y detente antes del siguiente
   incremento.
   ```

5. Comprueba: `npm.cmd test`, `npm.cmd run typecheck`, `npm.cmd run build` y el recorrido manual en navegador. Si pruebas Groq, registra la evidencia sin credenciales.
6. Anota en la tabla de la sección 3 el estado y lo que observaste. Detente aquí: la siguiente ficha empieza con su propio prompt 1.

## 6. Modelo, consumo y cuotas

- Modelo del ejercicio: `openai/gpt-oss-20b`. La API lo selecciona con `GROQ_MODEL`; el secreto es `GROQ_API_KEY`.
- Tarifa consultada el **2026-10-27**, en USD por millón de tokens: entrada **$0.075**, entrada en caché **$0.037**, salida **$0.30**. Una estimación no es una factura; los precios pueden cambiar.
- Revisa la [ficha pública del modelo](https://console.groq.com/docs/model/openai/gpt-oss-20b) y los [límites de Groq](https://console.groq.com/docs/rate-limits); cada persona revisa su propia organización.
- Usage o tarifa ausente no bloquea una respuesta válida ni se inventa como cero.

## 7. Referencias del paquete estudiante

- [Contrato API D1](../api-contract.md)
- [Arquitectura D1](../architecture.md)
- [Referencia de interfaz D1](interface-reference.md) y [versión HTML](interface-reference.html)
- [Reglas para trabajar con el agente](agent-prompts.md)
- [Mapa de archivos y TODO](template-file-map.md)
- [Cómo se creó la base desde una carpeta vacía](setup-from-scratch.md)
- [E1](../01-chat-integration.md)
- `AGENTS.md`, en la raíz del proyecto

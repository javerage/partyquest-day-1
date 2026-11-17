# Crear PartyQuest desde una carpeta vacía — Windows

> **Referencia opcional.** El repositorio que recibes ya contiene la base creada; en clase B1 consiste en instalarla y comprobarla según el [roadmap](roadmap.md). Esta página explica cómo se arma esa base paso a paso. Algunas rutas que menciona pueden diferir del proyecto entregado; cuando difieran, vale el [mapa de archivos](template-file-map.md).

Esta es la receta de B1, no la solución de chat. La receta completa aún no se ensayó en Windows.

## Antes de empezar

1. Completa [entorno y cuentas](../onboarding/README.md).
2. Localiza la carpeta de materiales descargada; debe contener `package.json`, el lockfile raíz, `frontend/`, `api/`, `docs/`, `scripts/`, `.opencode/` y `AGENTS.md`.
3. Elige una carpeta de trabajo escribible, independiente del repositorio privado del docente. No uses una carpeta que ya contenga otro proyecto.
4. Lee el [roadmap](roadmap.md). Pide autorización para cada incremento; la receta no autoriza avanzar automáticamente por todos.

## B1.1 — Crear la base

En PowerShell, desde tu carpeta de trabajo:

```powershell
New-Item -ItemType Directory -Path partyquest
Set-Location partyquest
```

Indica la ruta real de los materiales **extraídos**, no la del ZIP:

```powershell
$materials = Read-Host 'Ruta completa de la carpeta de materiales'
Copy-Item -LiteralPath (Join-Path $materials 'package.json') -Destination .
Copy-Item -LiteralPath (Join-Path $materials 'package-lock.json') -Destination .
Copy-Item -LiteralPath (Join-Path $materials 'frontend') -Destination . -Recurse
Copy-Item -LiteralPath (Join-Path $materials 'api') -Destination . -Recurse
```

Los manifiestos deben declarar los dos workspaces y versiones fijas. Se usa **un solo lockfile raíz**; no generes otros dentro de frontend o API.

```powershell
npm.cmd ci
npm.cmd ls --depth=0
```

`npm ci` instala lo fijado por el manifiesto/lockfile. No borres el lockfile ni cambies a `latest` para ocultar un error. Espera a que termine y revisa el código de salida con `$LASTEXITCODE` antes de continuar.

## B1.2 — Incorporar las reglas y la configuración

```powershell
Copy-Item -LiteralPath (Join-Path $materials '.gitignore') -Destination .
Copy-Item -LiteralPath (Join-Path $materials 'AGENTS.md') -Destination .
Copy-Item -LiteralPath (Join-Path $materials '.opencode') -Destination . -Recurse
Copy-Item -LiteralPath (Join-Path $materials 'scripts') -Destination . -Recurse
Copy-Item -LiteralPath (Join-Path $materials 'docs') -Destination . -Recurse
```

No copies `.git`, `node_modules`, credenciales ni archivos `.env` reales. No necesitas `GROQ_API_KEY` ni crear `.env` para B1. El ejemplo `api/.env.example` está pendiente en esta entrega por un bloqueo de escritura; su ausencia debe registrarse, no darse por resuelta. Las claves se configuran más adelante, solo en el servidor.

```powershell
npm.cmd run typecheck
node ./scripts/check-environment.mjs
```

Si el diagnóstico marca OpenCode ausente y lo ejecutas solo por ruta completa, sigue las instrucciones de [Windows](../onboarding/windows.md); no declares que la detección automática pasó.

## B1.3 — Arrancar la presentación

Abre **dos terminales** en la raíz de `partyquest/`.

Terminal A:

```powershell
npm.cmd run dev:api
```

Terminal B:

```powershell
npm.cmd run dev:frontend
```

Abre la dirección que muestre Vite; la configuración entregada usa `http://127.0.0.1:5173`. El alias `npm.cmd run dev` inicia **solo el frontend**, no ambos procesos. No uses recetas Unix con `& ...; wait` en PowerShell.

Comprueba la pantalla inicial y el selector «Apariencia». El envío está deshabilitado: no hay conversación conectada ni respuesta simulada que pretenda venir de Groq. No agregues voz, catálogo ni historial.

## B1.4 — Comprobar health y proxy

En una tercera terminal, sin configurar claves:

```powershell
$direct = Invoke-WebRequest -Uri 'http://127.0.0.1:8787/api/health'
$direct.StatusCode
$direct.Content
$proxy = Invoke-WebRequest -Uri 'http://127.0.0.1:5173/api/health'
$proxy.StatusCode
$proxy.Content
```

Ambos deben responder HTTP `200` y cuerpo `{"status":"ok"}`. Esto comprueba la API y el proxy same-origin; no demuestra conectividad con Groq. El endpoint `/api/chat` todavía no está implementado y no debe fingir éxito.

No habilites CORS permisivo para ocultar un proxy incorrecto. Si un puerto está ocupado, no mates procesos ajenos; identifica tu propio proceso o consulta al facilitador.

## Cerrar el incremento

1. Detén tus servidores con Control+C al terminar.
2. Registra versiones, comandos, códigos de salida, observaciones y fallos en tu copia del roadmap.
3. Comprueba la pantalla a aproximadamente 360 px y en escritorio, sin desbordamiento horizontal; revisa el menú y el foco del teclado.
4. No marques completo un requisito que no observaste, incluyendo los pendientes del material entregado.
5. Solo después del cierre y una nueva autorización pasa a **D1·B2.1**. Usa [los prompts](agent-prompts.md), el [contrato API](../api-contract.md) y la [arquitectura](../architecture.md).

## Si ya descargaste el repositorio ensamblado

Puedes revisar sus archivos y ejecutar los mismos comandos desde su raíz, sin copiarlo dentro de otra carpeta `partyquest-day-1`. Eso **no acredita haber realizado la creación desde carpeta vacía**. El facilitador decide el recorrido didáctico; no sustituyas el ejercicio por la aplicación docente resuelta.

## Límites de verificación

Los comandos PowerShell se presentan como receta a ensayar, no como ejecución ya observada en Windows. Las pruebas con proveedores falsos no validan cuentas reales. El [mapa de archivos](template-file-map.md) expresa la entrega objetivo y conserva su checklist: cualquier plantilla ausente sigue pendiente.

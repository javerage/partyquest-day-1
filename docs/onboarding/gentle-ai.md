# Gentle AI en OpenCode

**Gentle AI** agrega a OpenCode una forma de trabajo más ordenada: el agente explora el código antes de cambiarlo, mantiene los cambios pequeños, escribe primero una prueba cuando corresponde y comprueba el resultado antes de darlo por terminado. Además, recuerda decisiones del proyecto entre sesiones y protege tus archivos de claves.

Lo instalarás durante la **preparación del equipo del bloque 1**, después de tener OpenCode funcionando y antes de ejecutar las fichas B1.1–B1.4 del proyecto. Calcula unos 20 minutos, sin contar la velocidad de la red del aula.

## Qué cambia en tu forma de trabajar

| Sin Gentle AI | Con Gentle AI |
|---|---|
| El agente puede editar en cuanto recibe una petición. | Primero explora y explica; espera tu autorización para cambiar archivos. |
| Cada sesión empieza de cero. | **Engram** guarda decisiones y hallazgos del proyecto para la siguiente sesión. |
| Las pruebas dependen de que las pidas. | Cuando el comportamiento se puede probar, escribe primero una prueba que falla y después el código que la hace pasar. |
| El agente podría leer un archivo `.env`. | El componente **Permissions** le impide leer o editar archivos `.env` y otras credenciales. |

Gentle AI **no sustituye la hoja de ruta del taller**. Cada ficha sigue siendo la unidad de trabajo: revisas la propuesta, autorizas solo ese paso y compruebas el resultado. Gentle AI tampoco instala OpenCode: configura el que ya tienes.

## Antes de empezar

Necesitas estas herramientas disponibles en una terminal nueva:

| Herramienta | Comprobación en PowerShell | Si falta |
|---|---|---|
| OpenCode | `opencode --version` | Sigue la [guía de Windows](windows.md). Debe estar en el PATH: el instalador de Gentle AI se detiene si no encuentra `opencode`. |
| Node.js 18 o posterior y npm | `node --version` y `npm.cmd --version` | Sigue la [guía de Windows](windows.md). |
| Git | `git --version` | Paso 1 de esta guía. |
| Go 1.25.10 o posterior | `go version` | Sigue la [guía de instalación de Go](go.md). |

En Windows, Gentle AI se instala por ahora compilándolo con Go, porque todavía no hay instaladores oficiales para ese sistema. Solo necesitas Go para instalarlo y actualizarlo; no lo usarás en los ejercicios.

## 1. Instalar Git, si falta

1. Abre la [descarga oficial de Git para Windows](https://git-scm.com/downloads/win) y ejecuta el instalador.
2. Conserva las opciones predeterminadas, salvo que el instructor indique otra cosa.
3. Cierra y vuelve a abrir PowerShell, y comprueba:

**Windows — PowerShell:**
```powershell
git --version
```

## 2. Instalar Go, si falta

Sigue la [guía de instalación de Go en Windows](go.md) y vuelve aquí cuando `go version` muestre 1.25.10 o posterior en una terminal nueva.

## 3. Instalar Gentle AI

En PowerShell, desde cualquier carpeta:

**Windows — PowerShell:**
```powershell
go install github.com/gentleman-programming/gentle-ai/v4/cmd/gentle-ai@latest
```

La descarga y compilación pueden tardar algunos minutos. Después, abre una terminal nueva y comprueba:

**Windows — PowerShell:**
```powershell
gentle-ai version
```

Si PowerShell no reconoce `gentle-ai`, el programa se instaló en la carpeta `go\bin` de tu usuario, que todavía no está en tu PATH. Sigue el [paso 5 de la guía de Go](go.md#5-comprueba-la-carpeta-de-programas-de-go) y vuelve a ejecutar `gentle-ai version` en una terminal nueva.

> **En macOS:** instala con `brew install gentleman-programming/tap/gentle-ai` y continúa en el paso 4.

## 4. Configurar Gentle AI para OpenCode

Para el taller usaremos esta selección:

| Opción | Valor del taller | Para qué sirve |
|---|---|---|
| Agente | OpenCode | El asistente que usarás en clase. |
| Componentes | Engram, Skills, Context7 y Permissions | Memoria del proyecto, habilidades adicionales, documentación actualizada de librerías y protección de credenciales. |
| Persona | Gentleman | Un mentor exigente que explica los conceptos antes del código. |

Primero revisa qué cambiaría, **sin aplicar nada**:

**Windows — PowerShell:**
```powershell
gentle-ai install --dry-run --agent opencode --component engram,skills,context7,persona,permissions --persona gentleman
```

Lee el plan que aparece. Si solo menciona OpenCode y los componentes de la tabla, aplícalo:

**Windows — PowerShell:**
```powershell
gentle-ai install --agent opencode --component engram,skills,context7,persona,permissions --persona gentleman
```

Gentle AI guarda una copia de tu configuración antes de cada cambio. Al terminar, muestra un mensaje que indica que puedes ejecutar `opencode`.

## 5. Ajustar la revisión para el taller

Gentle AI incluye un sistema de revisión formal de cambios, llamado **RDD**, que viene activado. En el taller cada ficha ya define sus comprobaciones, así que lo desactivaremos para ahorrar tiempo de clase:

**Windows — PowerShell:**
```powershell
gentle-ai review mode disable
gentle-ai review mode status
```

El segundo comando debe indicar que la revisión está desactivada. Las pruebas y comprobaciones de cada ficha siguen siendo obligatorias.

## 6. Comprobar la instalación

**Windows — PowerShell:**
```powershell
gentle-ai doctor
```

`doctor` solo revisa; no cambia nada. Cada comprobación aparece como correcta, advertencia o error, con una sugerencia para resolverla. Si ves un error, compártelo con el instructor antes de continuar.

## 7. Primera conversación

1. Abre PowerShell en la carpeta del proyecto, la que contiene `package.json` y `AGENTS.md`.
2. Ejecuta `opencode`.
3. Escribe:

```text
Sin modificar archivos: lee AGENTS.md y docs/day-1/roadmap.md y explícame
qué voy a construir hoy y cómo se trabaja cada ficha.
```

Observa que el agente explora el proyecto y responde sin editar archivos. Las [cuatro skills del taller](skills.md) siguen disponibles: puedes invocarlas con `@increment-scope`, como indican las fichas.

## Cómo trabajar con Gentle AI durante el taller

- **Describe el resultado que buscas** y deja que el agente explore primero. Las fichas de la [hoja de ruta](../day-1/roadmap.md) ya traen la instrucción adecuada.
- **Autoriza un paso a la vez.** Que el agente proponga no significa que tenga permiso para avanzar a la siguiente ficha.
- **Observa la prueba fallar y luego pasar.** Ese ciclo, llamado RED y GREEN, es parte del método que Gentle AI aplica y del que trabajarás en clase.
- **Tú creas el archivo de la clave de Groq.** Con Permissions activo, el agente no puede leer ni editar archivos `.env`; cuando llegues a la ficha correspondiente, crearás tú mismo ese archivo en `api/`. Nunca pegues la clave en el chat.
- **No autorices commits, push ni publicaciones** salvo que el instructor lo indique. Si el agente propone crear un documento de tareas en `odd/tasks/`, consulta al instructor antes de aceptarlo: las fichas de este taller son pasos pequeños que normalmente no lo necesitan.
- **La memoria es local.** Engram guarda decisiones y hallazgos del proyecto en tu equipo. Puedes revisarla con `engram tui`. No le pidas guardar claves ni datos personales.

## Si algo falla

| Síntoma | Qué hacer |
|---|---|
| `go` o `gentle-ai` no se reconocen | Abre una terminal nueva. Si persiste, revisa el PATH con el [paso 5 de la guía de Go](go.md#5-comprueba-la-carpeta-de-programas-de-go). |
| El instalador se detiene porque no encuentra OpenCode | Comprueba que `opencode --version` funcione en una terminal nueva; revisa el PATH en la [guía de Windows](windows.md). |
| La compilación con `go install` falla o tarda demasiado | Revisa tu conexión y consulta al instructor. No uses instaladores de otras fuentes. |
| `gentle-ai doctor` muestra un error | Comparte el mensaje con el instructor, sin incluir claves ni datos personales. |
| Quieres deshacer la instalación | `gentle-ai uninstall --agent opencode` muestra lo que eliminará y respalda la configuración antes de hacerlo. |

## Para saber más

- [Repositorio de Gentle AI](https://github.com/Gentleman-Programming/gentle-ai) y su [guía de inicio](https://github.com/Gentleman-Programming/gentle-ai/blob/main/docs/quickstart.md).
- [Cómo está pensado su uso](https://github.com/Gentleman-Programming/gentle-ai/blob/main/docs/intended-usage.md).
- [Componentes, skills y presets](https://github.com/Gentleman-Programming/gentle-ai/blob/main/docs/components.md).
- [Telemetría: qué se registra y cómo desactivarla](https://github.com/Gentleman-Programming/gentle-ai/blob/main/docs/telemetry.md).

Instrucciones basadas en la documentación oficial consultada el 17 de noviembre de 2026, con la versión 4.5.0 como última publicada. Si la página oficial cambió, sigue sus indicaciones y avísale al instructor.

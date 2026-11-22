# Antes de empezar: entorno y cuentas

Prepara este entorno en el Día 1. Las instalaciones y los registros los realiza cada participante, conscientemente y con su propia cuenta. **El diagnóstico no instala nada ni valida cuentas o claves.**

## 1. Preparar las herramientas, en este orden

Esta es la primera etapa, incluso si ya clonaste el repositorio. Tú haces las instalaciones, no el agente. Durante la preparación de B1, junto con el instructor, completa cada paso antes del siguiente. Todavía no ejecutes las fichas del proyecto.

1. **Git.** Ejecuta `git --version`. Si falta, sigue [instalar Git](gentle-ai.md#1-instalar-git-si-falta) y vuelve a esta lista. Lo necesitas para clonar y para la instalación de Gentle AI.
2. **Node.js y npm.** Sigue [el paso 2 de Windows](windows.md#2-instalar-nodejs-y-npm-si-faltan). En una terminal nueva, `node --version` y `npm.cmd --version` deben mostrar sus versiones.
3. **OpenCode.** Sigue [el paso 3 de Windows](windows.md#3-instalar-opencode-nativo). Comprueba `opencode --version` en una terminal nueva; debe estar en el PATH para el diagnóstico y Gentle AI.
4. **Go en Windows.** Sigue la [guía de Go](go.md). `go version` debe mostrar la versión mínima indicada en esa guía. Go se usa para instalar Gentle AI, no para ejecutar PartyQuest.
5. **Gentle AI.** Sigue su [guía desde el paso 3](gentle-ai.md#3-instalar-gentle-ai), incluidos configuración, desactivación de RDD y comprobaciones. Git y Go ya deben estar preparados. No repitas instalaciones si ya funcionan. En macOS usa la alternativa indicada en esa guía.
6. **Acceso al modelo de OpenCode.** Abre `opencode`, prepara `/connect` y comprueba `/models` con el proveedor acordado con el instructor. Lee la distinción de proveedores más abajo. Una llamada de prueba requiere tu autorización y puede consumir cuota; no confundas ver el modelo en la lista con haber comprobado una respuesta.

## 2. Confirmar que el equipo está listo

Antes de pasar al proyecto, confirma:

- [ ] `git --version`, `node --version`, `npm.cmd --version` y `opencode --version` funcionan en una terminal nueva.
- [ ] En Windows, `go version` cumple el requisito de la guía.
- [ ] `gentle-ai version` funciona y `gentle-ai doctor` no informa errores.
- [ ] `gentle-ai review mode status` indica revisión desactivada.
- [ ] Tienes configurado el proveedor/modelo de OpenCode acordado; cualquier problema de acceso está resuelto con el instructor antes de usarlo en ejercicios.

Si algo falla, detente aquí y consulta al instructor. No avances al roadmap para descubrir después qué herramienta falta.

**Equipo listo: continúa con [B1.1: preparar el proyecto e instalar dependencias](../day-1/roadmap.md#d1b11--instalar-dependencias).** Si ya clonaste el repositorio, usa esa carpeta: no lo clones otra vez. B1.1 muestra cómo obtenerlo si aún no lo tienes. Después sigue B1.2–B1.4 y, finalmente, B2.1.

## Cuentas que se usan después

- **Groq para PartyQuest:** sigue su [guía](groq.md) al preparar B2.3; la clave se configura solo en el servidor. No hace falta para instalar dependencias, abrir la pantalla ni comprobar health.
- **Cohere:** [guía de cuenta](cohere.md) para embeddings en D2; no es un prerrequisito de D1.
- **Vercel:** [guía de cuenta](vercel.md) para despliegue posterior con autorización específica; no es un prerrequisito de D1.

## Referencia: diagnóstico del proyecto en B1.2

Este diagnóstico corresponde a B1.2, después de preparar el equipo e instalar dependencias. No es otro paso previo. En PowerShell puedes consultar las herramientas con:

**Windows — PowerShell:**
```powershell
Get-Command node, npm.cmd, opencode -ErrorAction SilentlyContinue
node --version
npm.cmd --version
```

Si Node falta, sigue [Windows](windows.md) antes de continuar. Desde la raíz que contiene `package.json`:

**Windows — PowerShell:**
```powershell
node ./scripts/check-environment.mjs
$LASTEXITCODE
```

- `0`: encontró las herramientas y los archivos que comprueba. **No significa que Windows, el proyecto o las cuentas estén completamente validados.**
- `1`: falta una herramienta/archivo o no se obtuvo una versión reconocida. Lee las líneas del informe.

Solo muestra versiones numéricas reconocidas, limita la espera de cada herramienta y no reproduce salidas arbitrarias de comandos. No instala, no consulta cuentas, no hace llamadas de prueba ni lee archivos de credenciales. No compara tu versión contra una compatibilidad que no se haya comprobado. Solo comprueba una selección de archivos del paquete, no sustituye instalación, build, health ni la revisión de enlaces.

Las pruebas del diagnóstico usan herramientas falsas aisladas en macOS; su rama `npm.cmd` y los recorridos de cuentas/OpenCode **todavía no se ejecutaron en Windows**.

## OpenCode y el modelo de PartyQuest son cosas distintas

Dentro de OpenCode, `/connect` permite elegir un proveedor de programación y `/models` revisar modelos disponibles. Usa únicamente una cuenta y modalidad que tú y el facilitador hayan acordado. No se promete que Groq esté disponible como proveedor de OpenCode ni que la clave del ejercicio configure automáticamente el agente.

Una suscripción, autorización OAuth o clave del agente no debe colocarse en PartyQuest. Tampoco pegues claves en prompts, capturas o mensajes del taller. Revisa las condiciones del proveedor y detente ante un costo o permiso inesperado. La existencia de una cuenta no demuestra conectividad: cualquier llamada real requiere tu autorización y puede consumir cuota.

## Qué copiar y qué no

El repositorio es material para construir el ejercicio, no una solución de chat. Sigue las fichas del [roadmap](../day-1/roadmap.md), una por una. No copies encima una aplicación docente resuelta.

Conserva `.opencode/` y `.gitignore` al descargar/copiar archivos. No copies `.git`, `node_modules`, archivos de entorno reales ni credenciales. El ejemplo `api/.env.example` está pendiente en esta entrega por un bloqueo de escritura; no se necesita una clave ni un archivo `.env` para health.

## Evidencia y fuentes

Documentación pública consultada durante la preparación del 17 de noviembre de 2026: OpenCode [instalación](https://opencode.ai/docs/), [skills](https://opencode.ai/docs/skills/), [proveedores](https://opencode.ai/docs/providers/); Groq [Quickstart](https://console.groq.com/docs/quickstart); Cohere [Get Started](https://docs.cohere.com/docs/get-started-installation); Vercel [Getting Started](https://vercel.com/docs/getting-started-with-vercel).

Las páginas, pantallas, modelos, requisitos de verificación y planes pueden cambiar. Estas referencias **no son evidencia de haber instalado OpenCode en Windows, creado cuentas o realizado llamadas reales**. No se promete gratuidad, una cuota concreta ni acceso a modelos específicos. Si el sitio exige pago, datos adicionales o permisos no previstos, consulta al facilitador antes de continuar.

# Antes de empezar: entorno y cuentas

Prepara este entorno en el Día 1. Las instalaciones y los registros los realiza cada participante, conscientemente y con su propia cuenta. **El diagnóstico no instala nada ni valida cuentas o claves.**

## Orden recomendado

1. [Instalar Node.js y OpenCode en Windows](windows.md).
2. [Crear o revisar tu cuenta de Groq](groq.md).
3. [Crear o revisar tu cuenta de Cohere](cohere.md).
4. [Crear o revisar tu cuenta de Vercel](vercel.md).
5. Abrir la carpeta del proyecto en OpenCode y [comprobar las cuatro skills](skills.md).
6. Ejecutar el diagnóstico y seguir la [guía del aula](classroom-guide.md).
7. [Instalar Go en Windows](go.md). Si puedes, descarga su instalador antes de la clase.
8. En el bloque 1, con el instructor: [instalar Gentle AI en OpenCode](gentle-ai.md).

| Herramienta o cuenta | Preparación D1 | Uso en el taller |
|---|---|---|
| Node.js y npm | Instalados y disponibles en una terminal nueva | Ejecutar frontend, API y herramientas locales |
| OpenCode | Instalar, abrir proyecto y revisar acceso a un modelo de programación | Trabajar con el agente por incrementos |
| Gentle AI | Se instala en clase durante el bloque 1 | Método de trabajo del agente, memoria del proyecto y protección de credenciales |
| Go 1.25.10+ | [Instalar si falta](go.md), para compilar Gentle AI en Windows | Solo para instalar o actualizar Gentle AI |
| Groq | Crear cuenta y comprobar acceso al panel | Configurar la clave **solo en el servidor**, al autorizar D1·B2.3 |
| Cohere | Crear cuenta y comprobar acceso al panel | Embeddings en D2; no instalar SDK ni crear índices en D1 |
| Vercel | Crear cuenta y comprobar acceso al panel | Despliegue posterior, con autorización específica; no importar proyectos en D1 |
| Git | Necesario para instalar Gentle AI; la descarga del proyecto puede hacerse por ZIP | Versionar el trabajo, no necesario para ejecutar el diagnóstico |

## Diagnóstico desde la carpeta del proyecto

En PowerShell, primero comprueba que Node exista:

```powershell
Get-Command node, npm.cmd, opencode -ErrorAction SilentlyContinue
node --version
npm.cmd --version
```

Si Node falta, sigue [Windows](windows.md) antes de continuar. Desde la raíz que contiene `package.json`:

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

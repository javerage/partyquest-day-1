# Windows: Node.js, npm y OpenCode

## Resultado esperado

Desde una terminal nueva puedes consultar las versiones de Node.js, npm y OpenCode, abrir el proyecto y localizar las [skills](skills.md). Esto prepara herramientas: todavía no conecta PartyQuest con Groq.

## 1. Revisar el equipo

1. Abre **Configuración → Sistema → Acerca de** y busca el tipo de sistema: x64 o ARM64.
2. Elige una carpeta escribible de tu usuario para el taller. Evita carpetas del sistema y rutas compartidas del docente.
3. Abre PowerShell sin privilegios de administrador y consulta:

```powershell
Get-Command node, npm.cmd, opencode -ErrorAction SilentlyContinue
```

Si una herramienta ya existe, comprueba su versión antes de reinstalar. No borres instalaciones ni cambies el entorno de otros proyectos para resolver un error del taller.

## 2. Instalar Node.js y npm, si faltan

1. Abre [las descargas oficiales de Node.js](https://nodejs.org/en/download).
2. Selecciona Windows y la arquitectura de tu equipo. Confirma con el facilitador la versión del taller antes de descargar.
3. Ejecuta conscientemente el instalador oficial y conserva npm y la opción de agregar Node al PATH. Si la instalación requiere permisos que no tienes, pide apoyo; no los eludas.
4. Cierra y vuelve a abrir PowerShell.
5. Comprueba:

```powershell
node --version
npm.cmd --version
```

La máquina de preparación reportó Node.js `26.13.1` y npm `11.20.0` el 17 de noviembre de 2026. **No es una certificación de esa instalación en Windows ni una garantía para versiones diferentes.** La referencia anterior del curso documentaba Node.js `26.12.1`; registra la versión que efectivamente uses.

Usamos `npm.cmd` en PowerShell para evitar depender de la ejecución de `npm.ps1`. No desactives ExecutionPolicy ni ejecutes una terminal administrativa para ocultar un error.

## 3. Instalar OpenCode nativo

La [documentación oficial consultada](https://opencode.ai/docs/) describe OpenCode V2 y dice que los gestores de paquetes de Windows no están soportados. **No uses recetas antiguas de npm, Scoop o Chocolatey como si estuvieran verificadas por este taller.** Tampoco necesitas instalar WSL para seguir esta ruta nativa.

1. Revisa la página oficial por si las instrucciones cambiaron.
2. Descarga el ZIP de la arquitectura correcta: [Windows x64](https://opencode.ai/update/api/latest/cli/opencode/opencode-windows-x64.zip) o [Windows ARM64](https://opencode.ai/update/api/latest/cli/opencode/opencode-windows-arm64.zip).
3. Extrae el ZIP en una carpeta de tu usuario; no ejecutes directamente desde el ZIP.
4. Abre esa carpeta en PowerShell y prueba:

```powershell
.\opencode.exe --version
```

Resultado esperado: una versión, no una solicitud de credenciales. El binario no se descargó ni ejecutó durante la preparación de esta guía.

5. Opcionalmente agrega esa carpeta al **PATH de usuario** desde la interfaz de variables de entorno de Windows. Conserva las entradas existentes; no reemplaces todo el PATH. Abre otra terminal y consulta `opencode --version`.
6. Si no modificas el PATH, usa la ruta completa. Ejemplo ilustrativo: sustituye la ruta por la carpeta real que elegiste.

```powershell
& 'C:\Users\TU_USUARIO\Tools\OpenCode\opencode.exe' --version
```

Para el diagnóstico automático, `opencode` debe estar disponible en el PATH. Si usas solo la ruta completa, registra esa limitación: el diagnóstico reportará la herramienta como ausente.

## 4. Abrir el proyecto y comprobar las skills

1. Descarga el repositorio o ZIP que entregue el facilitador y extrae **todos** los archivos, incluidos `.opencode/` y `.gitignore`.
2. Abre PowerShell en la carpeta que contiene `package.json` y `AGENTS.md`.
3. Ejecuta `opencode`, o usa su ruta completa desde esa misma carpeta.
4. Sigue la distinción entre [proveedor del agente y API del ejercicio](README.md#opencode-y-el-modelo-de-partyquest-son-cosas-distintas).
5. Pide: `Carga @increment-scope y lee AGENTS.md y docs/day-1/roadmap.md. No modifiques archivos; explica únicamente D1·B1.1.`
6. Revisa que el agente reconozca la skill y se detenga antes de editar. Consulta [skills](skills.md) si no aparece.

El primer prompt con un modelo puede consumir cuota. No presupongas acceso gratuito ni uses una cuenta ajena.

## Si algo falla

- **Comando no encontrado:** vuelve a abrir la terminal y revisa la ruta de usuario; no reinstales todo automáticamente.
- **Arquitectura incorrecta o binario bloqueado:** vuelve a la fuente oficial y consulta al facilitador. No desactives protecciones del equipo ni añadas exclusiones de seguridad.
- **Permiso o política de empresa:** solicita apoyo del responsable del equipo.
- **Proveedor/modelo no disponible:** registra el mensaje sin datos privados; no sustituyas proveedor ni aceptes costos sin decidirlo.

Continúa con [las cuentas y el diagnóstico](README.md). En el bloque 1 instalarás [Gentle AI](gentle-ai.md) sobre este OpenCode; antes necesitas [instalar Go](go.md), y la guía de Gentle AI explica cómo instalar Git si falta. La instalación real y el funcionamiento de OpenCode en Windows siguen pendientes de un ensayo en ese sistema.

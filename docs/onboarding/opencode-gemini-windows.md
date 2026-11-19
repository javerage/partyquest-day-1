# Cómo usar Gemini en OpenCode desde Windows

Esta guía explica cómo configurar `opencode-antigravity-auth` en OpenCode 2.x desde PowerShell e iniciar sesión con Google. No necesitas clonar el repositorio, compilar el plugin ni generar una API key. Los pasos se basan en el [README del plugin](https://github.com/NoeFabris/opencode-antigravity-auth#setup); no se han probado en un equipo Windows para esta guía.

> **Antes de autorizar:** el plugin no es oficial. Su mantenedor advierte que Google puede restringir cuentas que usen clientes de terceros. Si usas una cuenta de trabajo o de estudios, confirma que tu organización lo permite.

## 1. Comprueba los requisitos

Abre **Windows Terminal → PowerShell** y ejecuta:

```powershell
node --version
opencode --version
```

Necesitas **Node.js 20 o posterior** y **OpenCode 2.1.2 o posterior** para seguir estos pasos. Si falta alguno, instala una [versión LTS compatible de Node.js](https://nodejs.org/) o sigue las [instrucciones de instalación de la CLI de OpenCode](https://opencode.ai/docs/#install). Abre otra terminal y vuelve a comprobar las versiones. OpenCode 1.x tiene un flujo heredado con un menú distinto.

## 2. Agrega el plugin sin perder tu configuración

### 2.1. En PowerShell: pega y ejecuta el bloque completo

No necesitas crear un archivo `.ps1`. Copia desde `$dir =` hasta `notepad.exe $config`, pega el bloque directamente en PowerShell y presiona Enter. Si Windows Terminal te pregunta si quieres pegar varias líneas, esa advertencia se refiere a este bloque de comandos.

```powershell
$dir = Join-Path $HOME '.config\opencode'
$config = Join-Path $dir 'opencode.json'
New-Item -ItemType Directory -Path $dir -Force | Out-Null

if (Test-Path $config) {
    Copy-Item $config "$config.bak-$(Get-Date -Format yyyyMMdd-HHmmss)"
} else {
    New-Item -ItemType File -Path $config | Out-Null
}

notepad.exe $config
```

**Resultado esperado:** se abre `%USERPROFILE%\.config\opencode\opencode.json` en el Bloc de notas. Si el archivo ya existía, el bloque guarda una copia de respaldo en la misma carpeta antes de abrirlo.

### 2.2. En el Bloc de notas: edita la configuración

**Si el archivo está vacío**, pega el siguiente JSON completo en el Bloc de notas, incluidas las llaves. No lo pegues en PowerShell.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": ["opencode-antigravity-auth@2.1.2"]
}
```

**Si el archivo ya tiene contenido**, no lo reemplaces. Si ya existe la lista `plugins`, agrega el nuevo nombre entre comillas, separado del anterior por una coma. No lo agregues dos veces. Este ejemplo muestra solo la lista: conserva los nombres reales y el resto de tu archivo.

Antes (ejemplo):

```json
["mi-plugin-existente"]
```

Después (ejemplo):

```json
["mi-plugin-existente", "opencode-antigravity-auth@2.1.2"]
```

Si todavía no existe `plugins`, agrega `"plugins": ["opencode-antigravity-auth@2.1.2"]` como última propiedad antes de la llave de cierre. Si hay una propiedad anterior, añade una coma al final de esa propiedad para separarlas.

### 2.3. Guarda y vuelve a PowerShell

En el Bloc de notas, presiona `Ctrl+S` y cierra la ventana. **No ejecutes `opencode.json`:** OpenCode lo lee como configuración. Regresa a PowerShell y continúa con el inicio de sesión del paso 3.

Si ejecutas OpenCode en **WSL**, edita `~/.config/opencode/opencode.json` dentro de esa distribución y ejecuta OpenCode allí. Los bloques de PowerShell de esta guía son para Windows nativo.

## 3. Inicia sesión con Google

Cierra las sesiones interactivas de OpenCode que estuvieran abiertas. Desde PowerShell ejecuta:

```powershell
opencode auth login google
```

1. Selecciona **Google OAuth (Antigravity)**, no la opción de API key.
2. Sigue las indicaciones de la terminal. En el navegador, revisa la cuenta y los permisos antes de aceptar.
3. Regresa a la terminal para completar el flujo. El plugin puede reutilizar una cuenta ya registrada.

El archivo `~/.config/opencode/antigravity-accounts.json` contiene **credenciales**. No lo compartas, no lo subas a Git y no pegues su contenido en solicitudes de soporte.

## 4. Comprueba que Gemini responde

Lista los modelos disponibles para tu cuenta:

```powershell
opencode models | Select-String 'antigravity-gemini'
```

Copia un ID completo de la salida, incluido `google/`. Ejecuta este bloque en PowerShell y pega el ID cuando se te solicite:

```powershell
$modelo = Read-Host 'Pega el ID completo del modelo Gemini'
opencode run --model="$modelo" 'Responde en español con una sola frase: ¿qué es una prueba unitaria?'
```

El README muestra `google/antigravity-gemini-3.8-flash-high` como ejemplo, pero la disponibilidad depende de tu cuenta y plan. **Ver un modelo en la lista confirma que OpenCode lo detecta; recibir una respuesta confirma que puedes usarlo.**

## Guía rápida de uso

Los comandos con `$modelo` reutilizan la variable del paso 4 en la misma sesión de PowerShell.

| Para… | Haz esto |
|---|---|
| Hacer una pregunta puntual | En PowerShell: `opencode run --model="$modelo" 'Explica la diferencia entre Git y GitHub.'` |
| Conversar sobre un proyecto | Abre PowerShell en la carpeta del proyecto y ejecuta `opencode --model="$modelo"`. Prueba: «Explícame cómo está organizado este proyecto. No modifiques archivos». |
| Elegir entre Flash y Pro | Si ambos aparecen en tu lista, prueba **Flash** para consultas breves y resúmenes; prueba **Pro** para comparar alternativas o analizar varias restricciones. |
| Ver cuotas y tiempos de restablecimiento | Dentro de OpenCode, escribe `/ag` o `/antigravity` y selecciona **Check quotas / verify enabled accounts**. |
| Actualizar el catálogo de modelos | Abre `/ag` dentro de OpenCode y selecciona la opción para actualizar la lista. El plugin guarda el catálogo en caché durante una hora. |

## Si algo no funciona

- **No aparece Google OAuth (Antigravity):** revisa `opencode --version`, la propiedad `plugins` y que hayas editado el archivo del entorno que usas (Windows o WSL). Cierra OpenCode y vuelve a ejecutar el inicio de sesión.
- **No aparece el Gemini del ejemplo:** comprueba en `/ag` que la cuenta esté habilitada, actualiza el catálogo y usa un ID de tu propia lista.
- **Ya no aparecen los modelos de Google por API key:** el plugin los oculta mientras está seleccionado OAuth de Antigravity. Vuelven al cambiar a una conexión por API key.

**Referencias del mantenedor:** [Instalación y uso](https://github.com/NoeFabris/opencode-antigravity-auth#setup) · [Migración a OpenCode 2](https://github.com/NoeFabris/opencode-antigravity-auth/blob/HEAD/docs/OPENCODE-V2.md) · [Solución de problemas](https://github.com/NoeFabris/opencode-antigravity-auth/blob/HEAD/docs/TROUBLESHOOTING.md).

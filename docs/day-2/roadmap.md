# Entrada al Día 2: continúa con tu PartyQuest

Trabaja en la aplicación con la que cerraste D1. No clones el starter encima de ella: perderías la distinción entre tu solución y el ejercicio inicial. Si te falta alguna parte, vuelve al [cierre de D1](../day-1/roadmap.md) o pide al instructor una copia D1 terminada. No uses una solución D2 para empezar.

## Trae los archivos del Día 2 a tu proyecto

Descarga el repositorio público como ZIP desde https://github.com/javerage/partyquest-day-1 y descomprímelo en una carpeta separada, o clónalo allí. **Nunca** lo clones dentro de tu proyecto D1 ni sobre él. Por ejemplo, desde la carpeta que contiene tu proyecto:

```text
git clone https://github.com/javerage/partyquest-day-1.git partyquest-day-1-descarga
```

Con ZIP, usa el nombre de la carpeta que creó la extracción. En los comandos siguientes, `fuente` es esa carpeta separada y `proyecto` es la raíz de tu proyecto D1. Solo llevarás al proyecto `docs/day-2/`, `api/data/` y `.agents/skills/partyquest-place-contribution/`; **notes/ nunca se toca**.

**Antes de copiar, lista los conflictos** (archivos que ya existen en ambos lados). PowerShell, ajusta las dos rutas:

```powershell
$fuente = "..\partyquest-day-1-descarga"
$proyecto = "."
$rutas = @("docs/day-2", "api/data", ".agents/skills/partyquest-place-contribution")
foreach ($ruta in $rutas) {
  Get-ChildItem (Join-Path $fuente $ruta) -File -Recurse | ForEach-Object {
    $relativa = $_.FullName.Substring((Resolve-Path $fuente).Path.Length + 1)
    $destino = Join-Path $proyecto $relativa
    if (Test-Path $destino -PathType Leaf) { $relativa }
  }
}
```

macOS/Linux (ajusta `fuente` y `proyecto`):

```bash
fuente="../partyquest-day-1-descarga"
proyecto="."
for ruta in docs/day-2 api/data .agents/skills/partyquest-place-contribution; do
  find "$fuente/$ruta" -type f -print0 | while IFS= read -r -d '' archivo; do
    relativa="${archivo#"$fuente/"}"
    [ ! -e "$proyecto/$relativa" ] || printf '%s\n' "$relativa"
  done
done
```

Si aparece cualquier archivo, **detente**: compara las dos versiones y conserva tu versión. No reemplaces ni borres archivos para continuar; consulta al instructor si no sabes cómo integrar una diferencia. Si no hay conflictos, copia solo los archivos inexistentes. Usa la misma ventana de PowerShell, porque este bloque reutiliza `$fuente`, `$proyecto` y `$rutas`; comprueba `Test-Path` antes de copiar cada archivo:

```powershell
foreach ($ruta in $rutas) {
  Get-ChildItem (Join-Path $fuente $ruta) -File -Recurse | ForEach-Object {
    $relativa = $_.FullName.Substring((Resolve-Path $fuente).Path.Length + 1)
    $destino = Join-Path $proyecto $relativa
    if (-not (Test-Path $destino)) {
      New-Item -ItemType Directory -Force (Split-Path $destino) | Out-Null
      Copy-Item $_.FullName $destino
    } else {
      Write-Error "Ya existe; detén la copia y compara: $relativa"
    }
  }
}
```

macOS/Linux: primero revisa la lista de conflictos como arriba; `-n` evita sobrescribir incluso si aparece uno entre la revisión y la copia.

```bash
for ruta in docs/day-2 api/data .agents/skills/partyquest-place-contribution; do
  mkdir -p "$proyecto/$ruta"
  cp -Rn "$fuente/$ruta/." "$proyecto/$ruta/"
done
```

Comprueba el resultado listando `docs/day-2` en el proyecto (`Get-ChildItem docs/day-2` en PowerShell; `ls docs/day-2` en macOS/Linux). Debes ver `roadmap.md`, `b1.md` y los demás archivos del Día 2. Si detectas un archivo que ya existía o una diferencia, detente, compara y conserva tu versión; no copies encima. No copies ni modifiques `notes/`.

## Antes de B1

1. Identifica tu punto de regreso: rama y commit de D1 (`git status --short`, `git rev-parse --short HEAD`). Un hash no guarda cambios sin commit: conserva esos cambios antes de avanzar. No compartas configuración privada ni sobrescribas tu registro D1.
2. Comprueba la base con `npm test`, `npm run typecheck` y `npm run build` desde la raíz (en PowerShell, `npm.cmd`). No necesitas una clave real para esas pruebas. Si fallan, registra el comando y el error y revisa D1, no adaptes B1 al fallo.
3. Contrasta dos señales en D1: el cuerpo de `POST /api/chat` contiene solo `message`, y al recargar no reaparecen los mensajes. Si ya persisten, detente: puede que hayas abierto una copia más avanzada.
4. Confirma que tienes `api/data/places.json`, `api/data/corpus/lugares-valladolid.md` y `.agents/skills/partyquest-place-contribution/`. El índice **no** forma parte de la entrada: lo construirás en B3.
5. Crea tu registro personal una sola vez: copia [la plantilla de evidencia](progress-template.md) a `notes/day-2-progress.md`. En PowerShell: `New-Item -ItemType Directory -Force notes | Out-Null; Copy-Item docs\day-2\progress-template.md notes\day-2-progress.md`. En macOS/Linux: `mkdir -p notes && cp docs/day-2/progress-template.md notes/day-2-progress.md`. Si ya existe `notes/day-2-progress.md`, no lo sobrescribas: continúa usando tu copia. `notes/` nunca forma parte de la copia de archivos del Día 2.

## Una ficha a la vez

| Ficha | Señal que buscarás |
|---|---|
| [D2·B1.1 · Documento y validación](b1.md#d2b11--documento-y-validación) | Documento versionado y validación estricta. |
| [D2·B1.2 · Persistencia y fallos](b1.md#d2b12--persistencia-y-fallos) | Restauración y manejo de fallos de guardado. |
| [D2·B1.3 · Contexto y Nuevo plan](b1.md#d2b13--contexto-y-nuevo-plan) | Contexto acotado y reinicio controlado. |
| [D2·B1.4 · Envío interrumpido e integración](b1.md#d2b14--envío-interrumpido-e-integración) | Recuperación de un envío interrumpido. |
| [B2 · Preferencias](b2.md) | Una preferencia clara se aplica; una ambigua genera una pregunta. Preparas aportes con fuentes. |
| [B3 · Índice](b3.md) | Puedes recuperar el aporte desde el índice reconstruido y explicar su procedencia. |
| [B4 · Respuesta con fuentes](b4.md) | Pachi cita evidencia recuperada o reconoce que falta el dato. |
| [B4a · Seguimientos](b4a.md) | Tras la demostración, integras la continuidad en tu proyecto sin reemplazarlo. |
| [B5 · Streaming](b5.md) | Un corte no se guarda como respuesta completa. |
| [B6 · Preparación](b6.md) | Explicas cómo llegarán frontend, API y datos a Vercel; no despliegas hoy. |
| [Demostración final](demo.md) | Distingues lo que probaste localmente de lo observado con proveedores reales. |

**En OpenCode:** copia los prompts de cada ficha tal como están; ya llevan el ID y los archivos que el agente debe leer. Trabaja una ficha cada vez: el prompt 1 pide alcance, archivos, resultado esperado y comprobaciones **sin editar**. Revisa la respuesta; si coincide con la ficha y no amplía su alcance, usa el prompt 2 para autorizar únicamente ese incremento. Si el agente propone otra ficha, copiar una solución o usar servicios, deténlo. Si hay pruebas aplicables, verifica en su informe que se probaron antes de implementar (RED) y que pasan después (GREEN). Comprueba tú los resultados y registra evidencia; preparar una prueba no equivale a ejecutarla. Ante una comprobación fallida, guarda esperado y obtenido antes de decidir una corrección. Una llamada real requiere autorización aparte; si no se hace, registra «No evaluado». Tú llevas el registro personal.

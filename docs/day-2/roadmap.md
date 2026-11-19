# Entrada al Día 2: continúa con tu PartyQuest

Trabaja en la aplicación con la que cerraste D1. No clones el starter encima de ella: perderías la distinción entre tu solución y el ejercicio inicial. Si te falta alguna parte, vuelve al [cierre de D1](../day-1/roadmap.md) o pide al instructor una copia D1 terminada. No uses una solución D2 para empezar.

## Antes de B1

1. Identifica tu punto de regreso: rama y commit de D1 (`git status --short`, `git rev-parse --short HEAD`). Un hash no guarda cambios sin commit: conserva esos cambios antes de avanzar. No compartas configuración privada ni sobrescribas tu registro D1.
2. Comprueba la base con `npm test`, `npm run typecheck` y `npm run build` desde la raíz (en PowerShell, `npm.cmd`). No necesitas una clave real para esas pruebas. Si fallan, registra el comando y el error y revisa D1, no adaptes B1 al fallo.
3. Contrasta dos señales en D1: el cuerpo de `POST /api/chat` contiene solo `message`, y al recargar no reaparecen los mensajes. Si ya persisten, detente: puede que hayas abierto una copia más avanzada.
4. Confirma que tienes `api/data/places.json`, `api/data/corpus/lugares-valladolid.md` y `.agents/skills/partyquest-place-contribution/`. El índice **no** forma parte de la entrada: lo construirás en B3. Copia la [plantilla de evidencia](progress-template.md) a `notes/day-2-progress.md` solo si no existe.

## Una ficha a la vez

| Ficha | Señal que buscarás |
|---|---|
| [B1 · Contexto](b1.md) | La conversación vuelve al recargar, pero las coordenadas precisas no se guardan. |
| [B2 · Preferencias](b2.md) | Una preferencia clara se aplica; una ambigua genera una pregunta. Preparas aportes con fuentes. |
| [B3 · Índice](b3.md) | Puedes recuperar el aporte desde el índice reconstruido y explicar su procedencia. |
| [B4 · Respuesta con fuentes](b4.md) | Pachi cita evidencia recuperada o reconoce que falta el dato. |
| [B4a · Seguimientos](b4a.md) | Tras la demostración, integras la continuidad en tu proyecto sin reemplazarlo. |
| [B5 · Streaming](b5.md) | Un corte no se guarda como respuesta completa. |
| [B6 · Preparación](b6.md) | Explicas cómo llegarán frontend, API y datos a Vercel; no despliegas hoy. |
| [Demostración final](demo.md) | Distingues lo que probaste localmente de lo observado con proveedores reales. |

**En OpenCode:** sustituye el ID y el incremento en los prompts de la ficha. Primero pide alcance, archivos, resultado esperado y comprobaciones **sin editar**. Solo si coincide, autoriza ese incremento. Detén al agente si intenta otra ficha, copiar una solución o usar servicios. Tú llevas el registro personal. Preparar una prueba no equivale a ejecutarla; sigue el momento de ejecución indicado por cada ejercicio. Ante una comprobación fallida, guarda esperado y obtenido antes de decidir una corrección. Una llamada real requiere autorización aparte; si no se hace, registra «No evaluado».

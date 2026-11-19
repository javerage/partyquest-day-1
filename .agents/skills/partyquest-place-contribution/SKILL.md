---
name: partyquest-place-contribution
description: Ayuda al estudiante a preparar un aporte documentado al catálogo y corpus personales de PartyQuest, validarlo y pedir autorización explícita antes de editar archivos compartidos.
---

# Aportar lugares a PartyQuest

## Cuándo usar esta habilidad

Úsala cuando el estudiante quiera proponer lugares públicos para su propia copia del catálogo/corpus de D2. Consulta `place-sheet.md` para los campos y `templates/` para borradores.

## Reglas

- Usa evidencia aportada/consultada por el estudiante en la ficha de Maps o en una página oficial. No uses memoria del modelo ni completes por intuición.
- Sin respaldo, deja `null`, `unknown` o `unconfirmed`. No aproximar coordenadas desde el centro de una zona.
- La actividad de taller propone entre 3 y 5 lugares por estudiante; cada aporte requiere fuente y fecha.
- El validador comprueba estructura y coherencia, no veracidad ni vigencia.
- No edites catálogo/corpus sin explicar el cambio y recibir autorización explícita. El agente no escribe el catálogo de manera autónoma.
- Trabaja solo con D2·B2. No añadas campos/reglas D3, horarios de búsqueda contextual, índice o conducta de bloques posteriores.

## Flujo

1. Desde la raíz del bundle, confirma las rutas de catálogo `api/data/places.json` y corpus `api/data/corpus/lugares-valladolid.md`.
2. Revisa duplicados por ID y nombre normalizado y compara ubicación; registra la revisión en la ficha.
3. Completa una ficha y prepara `catalog-drafts/<id>/place.json` y `fragment.md` a partir de plantillas. Los drafts no son datos instalados.
4. Ejecuta validación local de borrador:

   ```sh
   node .agents/skills/partyquest-place-contribution/scripts/validate-places.ts --catalog api/data/places.json --corpus api/data/corpus/lugares-valladolid.md --draft catalog-drafts/<id>
   ```

5. Antes de tocar entradas originales, explica qué cambiará, muestra rutas/diff y solicita autorización explícita. Si el estudiante no autoriza, conserva solo sus borradores.
6. Tras autorización, inserta un registro y el fragmento en la sección correspondiente, preservando formato y evidencia. No inventes ni normalices contradicciones.
7. Valida el conjunto completo con el comando README. Informa errores, advertencias, desconocidos y límites. No declares veracidad por haber pasado el validador.

## Forma del fragmento

Un fragmento por lugar, encabezado exacto `### <nombre del catálogo>`, descripción respaldada y una línea `Horario:` consistente con el estado del catálogo. El corpus preserva procedencia, advertencias y contradicciones; no completar facts faltantes. D3 y el índice están fuera del kit.
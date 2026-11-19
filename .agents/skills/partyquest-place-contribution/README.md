# Kit estudiante: aportes de lugares PartyQuest

Este kit acompaña D2·B2 y D2·B3. Copia la carpeta completa dentro de `.agents/skills/partyquest-place-contribution/` del proyecto estudiante. No necesita dependencias externas; requiere Node 26 con ejecución directa de TypeScript.

Lee `SKILL.md` antes de actuar. Completa `place-sheet.md` y crea drafts desde `templates/place.json` y `templates/fragment.md`. El kit ayuda a documentar aportes; no edita por sí mismo y no valida que una fuente sea verdadera.

Desde la raíz del bundle, validar los datos entregados (solo lectura):

```sh
node .agents/skills/partyquest-place-contribution/scripts/validate-places.ts --catalog api/data/places.json --corpus api/data/corpus/lugares-valladolid.md
```

Validar un borrador en `catalog-drafts/<id>/` antes de incorporarlo:

```sh
node .agents/skills/partyquest-place-contribution/scripts/validate-places.ts --catalog api/data/places.json --corpus api/data/corpus/lugares-valladolid.md --draft catalog-drafts/<id>
```

Códigos de salida: 0 sin errores (avisos posibles); 1 errores de validación; 2 uso o lectura. El comando no hace llamadas de red. Los campos desconocidos deben permanecer `null`, `unknown` o `unconfirmed` según el esquema. Solo después de revisar el diff y recibir autorización expresa se modifican el catálogo y corpus. Los aportes se hacen en tu copia.

El catálogo y corpus incluidos corresponden al corte `partyquest-day-2` (54 lugares). No hay índice construido; no agregues un índice, conducta D3 ni solución de ejercicios al starter.
# Contrato de preferencias y filtrado — Día 2, B2

Este contrato para estudiantes define la petición y respuesta de B2, la interpretación de preferencias, filtrado determinista y aportes personales. No incluye una solución. Las reglas completas de incremento están en [fichas B2](b2.md). No copies datos o instrucciones de materiales docentes.

## Alcance

PartyQuest interpreta preferencias expresadas o confirmadas por la persona, filtra el catálogo estructurado y explica los datos no disponibles sin inventarlos. El catálogo JSON es la fuente para zona, servicio de comida, gasto y coordenadas. El corpus descriptivo no sustituye esos filtros. No hay radio máximo ni polígonos de cobertura; zona y cercanía son distintas. B2 no implementa RAG, indexado, horario, reservas, eventos/estado en vivo, streaming ni function calling.

## Petición HTTP

`POST /api/chat` conserva el chat y los campos B1 y agrega:

```json
{
  "message": "string, no vacío, máximo 2.000 unidades UTF-16",
  "history": [{ "user": "string", "pachi": "TurnoCompacto" }],
  "writtenZone": "string de 1 a 200 unidades UTF-16 | null",
  "preferences": {
    "zone": "historic-center | calzada-sisal | northern-neighborhoods | surroundings | null",
    "budget": { "amount": 1, "basis": "per_person | group_total" },
    "groupSize": "entero 1..30 | null",
    "wantsFood": "boolean | null",
    "nearMe": "boolean | null"
  },
  "location": { "latitude": "-90..90", "longitude": "-180..180" }
}
```

La forma anterior es ilustrativa: `budget` y `location` pueden ser `null`; `history` contiene de 0 a 6 pares completos; `writtenZone` vacía o solo espacios equivale a `null`. `amount` es entero MXN de 1 a 100.000; `groupSize` entero de 1 a 30. Las cinco claves de preferencias siempre están presentes. `valladolid-unspecified` no es una zona pedible. `category` y `foodTypes` no son filtros. No se envían `sessionId`, `userId` ni `conversationId`. Coordenadas solo en memoria, no persistidas ni enviadas al modelo. La API deriva `locationAvailable`.

**En B2.1:** `message`, `writtenZone`, `preferences` y `location` son obligatorios; omitir `history` equivale a `[]`. Para `writtenZone`, `null`, vacío o solo espacios equivalen a `null`; en otro caso, mide el máximo de 200 unidades UTF-16 sobre el valor recibido, incluidos los espacios exteriores. Las coordenadas son números finitos, no cadenas.

Petición inválida, campos extra, más de seis pares o valores fuera de dominio: HTTP 400 `invalid_request`, `retryable: false`, proveedor no llamado. Validar el estado recibido del cliente: es entrada no confiable.

## Preferencias e interpretación

Preferencias: `zone`, `budget`, `groupSize`, `wantsFood`, `nearMe`. El modelo realiza una llamada estructurada y propone `keep`, `set` o `clear` por preferencia. La API valida la salida, fusiona con el estado recibido y devuelve el estado completo validado. `keep` conserva; `set` reemplaza; `clear` establece null. Una preferencia no mencionada queda `keep`; actualizar una no borra las demás. `set` requiere valor de dominio válido; `keep` y `clear` requieren `value: null`.

Se aplican directamente valores explícitos y confirmaciones inequívocas de propuesta única. Los turnos previos de Pachi dan contexto para interpretar respuestas breves, pero sus sugerencias no establecen una preferencia sin confirmación. Ante ambigüedad que pueda cambiar los filtros, hacer una pregunta puntual, preservar todas las preferencias (`keep`) y no filtrar. No exigir confirmación general ni preguntar por expresiones vagas que no cambian la búsqueda. Una salida inválida del modelo responde `provider_error` (HTTP 502, `retryable: true`), sin filtrado ni cambios; no hay reintento automático.

Orden de aclaración: primero objetivos combinados no comprobables y aceptación explícita de búsqueda parcial; luego base del presupuesto, cantidad de personas cuando haga falta, y zona/ubicación. No se pregunta fecha u hora: B2 no filtra horarios. `writtenZone` es contexto libre: el modelo solo lo convierte mediante `set` en zona válida si es claro; de otro modo pregunta. El filtrador nunca usa texto libre.

Con objetivos no comprobables combinados, preguntar qué es indispensable. Priorizar algo comprobable no significa aceptar omitir lo demás: solicitar consentimiento explícito antes de buscar solo ese alcance. Si la persona declara indispensable algo no comprobable o rechaza la búsqueda limitada, respuesta terminal sin filtrar y preferencias sin cambios. Los textos genéricos no nombran la actividad no verificable. Características descriptivas consultables en bloques posteriores no se añaden a B2.

Si al fusionar no hay ninguna preferencia activa, no ejecutar filtrador y responder con guía fija: «Cuéntame qué plan buscan: en qué zona, si quieren comer, cuánto quieren gastar o cuántas personas son.» Si ya existen preferencias activas y no cambian, repetir la búsqueda vigente.

## Filtrado determinista

- `zone` determina elegibilidad; `nearMe` solo ordena. `locationScope` no interviene. Presupuesto solo se compara con gasto de comida; si no se busca comida, se conserva y se explica.
- Buscar comida excluye `foodService: unknown`; esto no prueba que el lugar no sirva comida.
- Comparar presupuesto por persona con rango estimado por persona. Si el mínimo cabe pero máximo excede, puede coincidir con advertencia exacta: «Gasto estimado de ${min} a ${max} por persona: puede superar tus ${presupuesto}.» Si mínimo supera, no coincide. Rango es estimación, no garantía.
- Presupuesto total grupal se divide entre cantidad explícita conocida; comparar valor exacto, mostrar referencia redondeada hacia abajo: «≈ ${importe} por persona si lo dividen en partes iguales». Si unidad o cantidad no está clara, preguntar. «Barato/económico» sin importe no fija presupuesto ni requiere aclaración.
- Si zona y comida coinciden pero gasto es desconocido, mostrar aparte: «Sin dato de gasto: no puedo compararlos con tu presupuesto». Nunca barato ni coincidencia verificada. Si se pide zona, `valladolid-unspecified` solo en «Sin zona registrada: no cuentan como coincidencias», no cuenta como coincidencia aun si gasto también es desconocido.
- Solo con `nearMe: true` y ubicación actual: calcular distancia recta para coordenadas verificadas, ordenar por distancia, separar elegibles sin coordenadas bajo «Sin ubicación registrada: no puedo calcular la distancia», y recomendar la medible más cercana. No afirmar que sea la más cercana de todo el catálogo si hay elegibles no medibles. Sin ubicación o `nearMe` distinto de true: alfabético, sin distancia/recomendada; sin coordenadas permanece entre coincidencias.
- Mostrar hasta 3 coincidencias y hasta 3 por sección aparte; indicar «… y {n} más» cuando corresponda. Ninguna coordenada o distancia se inventa; no usar centro de zona como ubicación.
- Sin coincidencias: no relajar filtros ni ofrecer alternativas que los incumplen; explicar y preguntar qué condición puede cambiar, salvo condición innegociable. No evaluar gasto desconocido como coincidencia.
- Código filtra y compone plantillas desde resultados. No segunda llamada al modelo para redactar resultados.

## Textos exactos de Pachi

Copias exactas de aclaraciones: «¿El presupuesto es por persona o total del grupo?»; «¿Cuántas personas son?»; «Para ordenar las opciones por cercanía puedo usar tu ubicación. ¿O prefieres escribir la zona?»; «Ya busco en {zona}. ¿La mantengo y ordeno por cercanía, o busco en todas las zonas?»; «Escribiste «{writtenZone}». ¿Corresponde a Centro histórico, Calzada de los Frailes y Sisal, Barrios del norte o Alrededores de Valladolid?»; «Puedo buscar lugares por zona, comida, presupuesto y cercanía, pero no comprobar las demás actividades que mencionas. ¿Qué es indispensable para ustedes?»; «¿Quieres que busque solo con lo que sí puedo comprobar?»; terminal: «No puedo comprobar esa actividad, así que no puedo recomendar un lugar que garantice cumplirla.»; sin coincidencias: «No encontré lugares{frase}. ¿Qué quieres cambiar: {opciones}?». La plantilla de presupuesto no aplicado a comida es «El presupuesto solo lo comparo con el gasto en comida. ¿Buscas dónde comer?».

## Compactos, respuesta y privacidad

Turno compacto: `{ "kind": "conversation | clarification | results | no_matches", "text": "string | null", "question": "string | null", "applied": Preferencias }`. `text` solo para conversation; `question` solo para clarification. B2 nuevos compactos no incluyen nombres, precios, distancias ni otros datos de lugares; una pregunta conserva su texto. Objetivo terminal no disponible y guía sin preferencias usan `conversation`.

En B2.1 aún no hay interpretación: la respuesta devuelve las preferencias recibidas y validadas, también en `compact.applied`. El turno `conversation` devuelto debe poder usarse como historial de la petición siguiente, incluso con preferencias no nulas.

Respuesta exitosa incluye `reply`, `model`, `usage`, `compact` y `preferences` completas y validadas; cliente reemplaza su estado local solo con ese estado validado. Persistir preferencias estructuradas separadas del historial, incluso si el mensaje de origen sale de la ventana. Historial incluye mensajes completos de persona y respuestas de Pachi compactas, aceptando `conversation` heredado de B1. Turnos `clarification`, `results`, `no_matches` se pasan al modelo como frase corta sin datos de lugar ni claves del compacto; la de `no_matches` indica que no hubo coincidencias con esos filtros, sin afirmar falta de disponibilidad. B2.1 acepta los cuatro tipos en `history`, aunque solo produce `conversation`. Texto heredado B1 puede contener menciones no verificadas; no son datos del catálogo.

La interfaz no muestra panel, chips ni sección de preferencias: condiciones aparecen solo en el texto de Pachi/resultados. La API no conserva estado entre peticiones. Solo API accede a Groq; coordenadas no llegan al proveedor. Logs mínimos no contienen mensajes, zona, coordenadas ni credenciales. `usage` ausente/desconocido nunca es cero. JSON estructuralmente válido no demuestra interpretación semántica.

## Aportes personales

Cada estudiante prepara de 3 a 5 lugares públicos de Valladolid para su propia copia de catálogo y corpus. Sigue `.agents/skills/partyquest-place-contribution/SKILL.md` y `place-sheet.md`: evidencia aportada/consultada de ficha de Maps o página oficial, fuente y fecha; revisa duplicados por ID/nombre normalizado y ubicación. Sin respaldo, conserva `null`, `unknown` o `unconfirmed`; no uses memoria ni aproximaciones. Guarda drafts en `catalog-drafts/<id>/`, no son datos instalados. Valida localmente con el validador de la skill antes de incorporar. El validador comprueba estructura/coherencia, no verdad ni vigencia. Antes de modificar catálogo/corpus compartidos, explica cambio, muestra rutas/diff y solicita autorización explícita. Sin autorización, solo borradores. No usar red automáticamente ni añadir horarios de búsqueda, índice o reglas posteriores.

## Límites y verificación

Las pruebas deterministas usan proveedor fake y catálogo controlado; no demuestran calidad semántica del modelo real ni conectividad. Cualquier llamada real a Groq requiere autorización específica separada. Si no se hace, reportar «No evaluado». RAG/índice, respuestas fundamentadas, streaming y referencias a lugares mostrados pertenecen a otros bloques. No inventar hechos ausentes ni afirmar implementación/publicación sin observarla.

Para los aportes rige también la skill incluida en `.agents/skills/partyquest-place-contribution/`. Este documento es la referencia del paquete para B2.

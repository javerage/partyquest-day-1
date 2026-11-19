# Contrato de interpretación contextual — Día 2, B4a

Este contrato define cómo Pachi interpreta continuaciones y referencias a los lugares que mostró. Especifica el comportamiento que integrarás en tu proyecto; no incluye una solución. Las [fichas de B4a](b4a.md) ordenan el trabajo. Las pruebas con proveedores simulados no miden la calidad de la interpretación del modelo real.

## Objetivo y compatibilidad

B4 sigue vigente en todo lo demás ([contrato de respuestas](answer-contract.md)). En B4, «¿cuál de esos…?» se busca entre todas las coincidencias elegibles, incluso las no mostradas; en B4a, «esos» apunta solamente a la lista principal mostrada más recientemente. Las preferencias conservan las reglas de B2 ([contrato de preferencias](preferences-contract.md)).

## Definiciones

- **Lista mostrada:** únicamente la lista principal de hasta tres lugares visibles, en el orden de presentación; nunca las secciones aparte.
- **Orden:** alfabético, o por distancia cuando aplica `nearMe` con ubicación; el mismo que ve la persona.
- **Lista vigente:** los `shownPlaceIds` del turno de búsqueda más reciente del historial (`results` o `no_matches`), si es un `results` que los tiene. Un `no_matches` posterior la borra, aunque la búsqueda no encuentre resultados. Un turno `results` guardado antes de B4a no tiene lista. Los turnos `conversation`, `clarification` y `answer` no la cambian.
- **Alcance en el historial:** solo cuenta lo que llega en el historial enviado. Si la ventana de seis intercambios ya no incluye el turno de la lista, no hay lista vigente y una referencia a ella aplica A4.
- **Búsqueda en curso:** los turnos `results` consecutivos con las mismas preferencias aplicadas, comparadas campo por campo (el orden de las claves no importa). Un `no_matches` o un turno con otras preferencias la cortan. Si la persona repite la misma búsqueda a propósito, cuenta como continuación.
- Los IDs son identificadores del catálogo, no hechos ni sustitutos de la descripción.

## Reglas A1–A4

**A1 — Referencia plural a resultados.** Con lista vigente, «¿cuál de esos tiene comida?» busca información solo entre sus IDs y no pide aclaración por la referencia plural. La elegibilidad se limita a esos IDs, además de respetar preferencias y las reglas de recuperación de B4. Ejemplo: tras mostrar tres resultados y «… y 4 más», «¿cuál de esos tiene comida?» se refiere a esos tres, no a los cuatro no mostrados.

**A2 — Ordinal o nombre.** «¿El segundo tiene música en vivo?» resuelve el segundo ID en el orden mostrado. «¿St. Patrick's tiene aire acondicionado?» resuelve ese lugar solo si aparece una única vez en la lista vigente (nombre del catálogo: `St. Patrick's Irish Pub`). Solo se continúa si hay exactamente un referente posible; cero o varios activan A4.

**A3 — Seguimiento o búsqueda nueva.** «¿Y alguno con alberca?» es una continuación que restringe la consulta a los lugares mostrados; «ahora quiero un plan de cenotes» es una búsqueda nueva y actualiza preferencias según B2. Una búsqueda nueva invalida la lista anterior aunque no encuentre resultados; solo una nueva respuesta `results` establece la lista siguiente. No se infiere una preferencia por una sugerencia de Pachi.

**A4 — Referencia ambigua.** Si el referente puede ser más de un lugar, Pachi pide que se identifique; por ejemplo, si dos de tres mostrados son bares, «¿y el bar tiene estacionamiento?» no escoge uno. «¿El segundo?» sin lista vigente también requiere aclaración.

## Coincidencias no mostradas

«No mostradas» son las coincidencias de la lista principal filtrada con las preferencias vigentes que no se han mostrado en la búsqueda en curso; nunca las secciones aparte.

- Una pregunta sobre ellas, como «¿y los otros tienen música en vivo?», se responde entre las no mostradas, con las reglas de evidencia de B4.
- Un «¿y los otros?» sin pregunta muestra hasta tres no mostradas, en el mismo orden, como un turno `results` nuevo; esa lista pasa a ser la vigente. Repetirlo sigue avanzando sin volver a mostrar lugares de la búsqueda en curso.
- La respuesta empieza con «Estas son otras opciones{condiciones}:», donde {condiciones} es la misma frase que usa la búsqueda, por ejemplo «Estas son otras opciones en Centro histórico:». Sigue con «(en orden alfabético)» cuando corresponde, las líneas de los lugares, «… y n más» si todavía quedan, la nota de distancias dentro del mismo bloque y la nota de fuente del catálogo.
- Si no quedan no mostradas, Pachi responde «Ya te mostré todas las opciones que encontré{condiciones}.», por ejemplo «Ya te mostré todas las opciones que encontré en Centro histórico.». Es un turno `conversation`, así que no cambia la lista vigente.
- Si el mensaje también cambia preferencias, ya no continúa la búsqueda en curso: es una búsqueda nueva.

## Lugares que ya no cumplen

Si las preferencias cambiaron después de mostrar la lista sin una búsqueda nueva, «esos» sigue siendo la lista que la persona vio. Pachi responde sobre ella y al final agrega «Ojo: X ya no coincide con lo que buscas ahora.»; con dos lugares, «Ojo: X y Y ya no coinciden con lo que buscas ahora.»; con tres, «Ojo: X, Y y Z ya no coinciden con lo que buscas ahora.». Los nombres salen del catálogo, en el orden de la lista. No los excluye en silencio.

## Salida de interpretación

Se conservan `clarification`, `searchText` y `changes` de B4 y se agrega el campo obligatorio `reference`: `null` si el mensaje no se refiere a lugares mostrados, o `{ "target": "shown" | "unshown" | "place", "placeId": string | null }`.

- `shown` limita la consulta a la lista vigente (A1).
- `unshown` se refiere a las coincidencias no mostradas de la búsqueda en curso.
- `place` se refiere a un lugar de la lista vigente (A2).
- `shown` y `unshown` llevan `placeId: null`. Si `clarification` no es `null`, `reference` debe ser `null`. Targets desconocidos, claves extra, `placeId` no textual, `shown` o `unshown` con ID no nulo, y `reference` junto con `clarification` responden `provider_error` (HTTP 502).
- `{ "target": "place", "placeId": null }` es una forma válida: el servidor la resuelve como `place_reference`.

Si no hay lista vigente, si un ID no existe en el catálogo o si `placeId` no está en la lista, el servidor aplica el código `place_reference` con el texto fijo «¿A cuál de los lugares mostrados te refieres?» (A4). `what_to_change` no se usa para referencias a lugares, porque su texto pregunta qué cambiar de la búsqueda. Toda aclaración deja `searchText: null` y conserva las preferencias de la petición, aunque el modelo haya propuesto cambios.

## Casos que resuelve el servidor

- **Referencia sin pregunta.** Si la referencia es resoluble y es `place` o `shown`, pero `searchText` es `null`, el servidor pregunta «¿Qué quieres saber de ese lugar?» o «¿Qué quieres saber de esos lugares?». La aclaración conserva las preferencias, no filtra ni consulta descripciones, y no forma parte de los códigos que el modelo puede devolver. Si las preferencias propuestas no son todas `keep`, se conserva el comportamiento de búsqueda existente.
- **Sin cambios tras una lista.** Con lista vigente, `reference: null`, `searchText: null`, sin aclaración y con preferencias fusionadas iguales al `applied` del turno de búsqueda más reciente, se avanza de página como con `unshown`: hasta tres no mostradas, o el texto de agotamiento. Sin lista vigente, B2 sigue repitiendo la búsqueda normal.
- **Instrucción de interpretación.** Indica de forma genérica que una descripción singular que encaja con más de un lugar mostrado es ambigua; que «los demás», «los otros» y «los que no mostraste» son siempre `unshown`; y que una pregunta sobre lugares mostrados conserva su consulta en `searchText` además de `reference`.

## Turno compacto, historial y documento guardado

- El turno `results` guarda `shownPlaceIds`: hasta tres IDs del catálogo en el orden mostrado; solo IDs, sin nombres, precios, distancias ni hechos.
- **Validación:** la API y el frontend validan solo la forma: un arreglo de cero a tres textos no vacíos, sin espacios solos ni repetidos, y solo en turnos `results`. No se rechaza una petición porque un ID ya no esté en el catálogo; si un ID de la lista vigente ya no existe, la lista no es resoluble y una referencia a ella aplica A4.
- **Historial para el modelo:** solo el turno de la lista vigente agrega sus lugares numerados, con nombre e ID del catálogo, por ejemplo «1. Bar El Yukt’ko (bar-el-yuktko)». Nunca recibe precios, distancias ni descripciones, ni nombres reconstruidos desde el texto visible.
- **Documento guardado:** pasa a `version: 2`, con `shownPlaceIds` opcional en los turnos `results`. Un documento `version: 1` se abre con todos sus mensajes y se reescribe de inmediato como `version: 2` con el mismo contenido; sus resultados no tienen lista, así que una referencia a ellos pide aclaración. Cualquier otra versión sigue siendo incompatible y sigue el procedimiento de permiso de B1 ([contrato de persistencia](persistence-contract.md)).
- Cambiar el historial y el documento guardado afecta datos de la persona: la migración se propone y se revisa antes de autorizarla, se prueba con documentos ficticios aislados y nunca borra ni convierte datos en silencio.

## Criterios y pruebas deterministas

Las pruebas se escriben antes de implementar, por la interfaz pública y con proveedor simulado. Comprueban la entrada enviada, la salida, las preferencias, los IDs elegibles para la búsqueda y que una aclaración no filtre.

1. **A1:** una referencia plural tras resultados restringe la búsqueda a los IDs mostrados, aunque haya más coincidencias; no produce `what_to_change`.
2. **A2 ordinal:** resuelve exactamente el índice según el orden mostrado (alfabético o por distancia).
3. **A2 por nombre:** un nombre único en la lista resuelve; un nombre ausente o ambiguo pide aclaración.
4. **A3 seguimiento:** conserva preferencias y limita el contexto a la lista vigente.
5. **A3 búsqueda nueva:** aplica los cambios de B2 e invalida la lista anterior aunque no haya coincidencias; solo un `results` establece una lista nueva.
6. **A4:** ambigüedad, sin lista vigente o con un ID que ya no existe producen `place_reference` con su texto fijo, sin cambiar preferencias, sin filtrar ni consultar descripciones.
7. **No mostradas con pregunta:** consulta solo coincidencias no mostradas; si no quedan, responde el texto de agotamiento.
8. **«¿Y los otros?» sin pregunta:** devuelve un `results` con hasta tres no mostradas y su texto; repetido, no vuelve a mostrar lugares; las mismas preferencias con otro orden de claves continúan la búsqueda.
9. **Ya no cumplen:** responde sobre la lista vista y agrega el aviso en singular o plural correcto.
10. **Documento:** `version: 2` se guarda y se abre igual; `version: 1` se abre, se reescribe como `version: 2`, sus resultados no tienen lista y una referencia a ellos aplica A4.
11. **Regresión:** `conversation`, `clarification`, `no_matches` y `answer` existentes conservan sus compactos y su contenido.
12. **Referencia sin pregunta:** `place` y `shown` sin `searchText` generan sus preguntas fijas, conservan preferencias y no filtran; con cambios propuestos no todos `keep`, se conserva el comportamiento anterior.
13. **Sin cambios tras una lista:** avanza de página de forma acumulativa, usa el texto de agotamiento al terminar y, sin lista vigente, conserva la búsqueda de B2.
14. **`place` sin ID:** `place_reference` con HTTP 200; `shown` con ID no nulo sigue en HTTP 502.
15. **Instrucción:** contiene las tres reglas genéricas de «Casos que resuelve el servidor».

## Evaluación real separada

La calidad de la interpretación solo se observa con el modelo real, con autorización explícita de llamadas y cuota; sin ella, el resultado es «No evaluado». Si se autoriza: escribe antes de ejecutar las preguntas para A1–A4 y lo esperado de cada una (qué debió entender y si debió responder, aclarar o buscar), fija un umbral antes de medir, no reintentes automáticamente y registra también los fallos del proveedor. Este contrato no autoriza ninguna llamada.

## Límites conocidos

- La búsqueda en curso y la lista vigente solo cubren la ventana de seis intercambios: una página anterior a esa ventana puede volver a mostrarse.
- Un documento `version: 2` abierto en una interfaz anterior a B4a se trata como incompatible y sigue el flujo de permiso de B1.
- En la evaluación del taller con el modelo real, la interpretación no alcanzó el umbral fijado: el modelo puede tratar una referencia ambigua como pregunta nueva y responder sobre un lugar que la persona no eligió (por ejemplo, «el bar» entre tres bares mostrados). Los casos más débiles fueron pedir más opciones sin decir nada más, «los demás» y conservar la pregunta junto con la referencia. Las pruebas deterministas no cubren ese riesgo.
- Con la regla «sin cambios tras una lista», cualquier mensaje que no cambia nada ni pregunta nada después de una lista vigente, como «gracias», muestra la página siguiente.

# Día 2 · Bloque 4a — Seguimientos contextuales

**Resultado del bloque.** Que Pachi entienda continuaciones y referencias a los lugares que mostró: «¿cuál de esos…?», «¿el segundo…?», «¿y los otros?». Integras el cambio en tu mismo proyecto, conservando B4 y tus conversaciones guardadas. No es una aplicación nueva ni se copia una solución.

**Punto de partida.** Necesitas B4 terminado y [el contrato de interpretación contextual](contextual-interpretation-contract.md). No hay marcadores `TODO(D2…)`: cada prompt parte de esta ficha y del contrato. Las rutas que ves aquí son probables.

**Fichas:** [D2·B4a.1](#d2b4a1--lista-mostrada-y-documento-versión-2) · [D2·B4a.2](#d2b4a2--referencia-y-resolución) · [D2·B4a.3](#d2b4a3--continuaciones-y-otras-opciones) · [D2·B4a.4](#d2b4a4--revisión-en-navegador-y-evaluación-real)

**Antes de la primera ficha: la demostración.** El docente muestra en su proyecto de demostración cómo se conserva el orden de la lista, cómo se resuelven ordinal, plural y nombre único, y cómo una referencia ambigua pide aclaración. Anota por separado lo que observas y los límites conocidos. La demostración no autoriza cambios en tu proyecto ni afirma que la calidad esté aprobada.

Escribe y ejecuta las pruebas en cada ficha, con proveedores simulados: RED antes de GREEN. **Nunca uses tus conversaciones reales como datos de prueba**: los documentos guardados se prueban con documentos ficticios en almacenamiento aislado. Si aparece una decisión de migración no acordada, el agente se detiene; no se resuelve reiniciando ni sobrescribiendo. Las llamadas reales requieren tu autorización aparte; sin ella, registra «No evaluado».

**Informe y RED.** En el informe separa las pruebas con RED observado, las que pasaron desde antes de implementar (sin RED) y las comprobaciones manuales o de navegador pendientes. Enumera cada prueba existente que cambió y el motivo específico de esta ficha. Las anotaciones de ejemplo al final de las fichas no predicen el resultado: conserva solo el RED que realmente observaste y registra por separado los casos sin RED.

---

## D2·B4a.1 — Lista mostrada y documento versión 2

### Datos de la ficha

- **Abre:** el turno compacto `results` en la API y en el frontend (rutas probables: `api/src/features/chat/application/compact-turn.ts` y `frontend/src/features/chat/model/compact-turn.ts`).
- **También:** la validación del historial en la API y el documento guardado del frontend (probable: `frontend/src/features/chat/model/conversation-document.ts`).
- **Pruebas:** pruebas públicas de API y frontend con documentos ficticios `version: 1` y `version: 2`.
- **Lectura:** [contrato de interpretación contextual](contextual-interpretation-contract.md), secciones «Definiciones» y «Turno compacto, historial y documento guardado»; [contrato de persistencia](persistence-contract.md).

### Reglas que aplica esta ficha

El turno `results` guarda `shownPlaceIds`: hasta tres IDs del catálogo en el orden mostrado, sin nombres, precios, distancias ni hechos. La API y el frontend validan solo la forma: arreglo de cero a tres textos no vacíos, sin espacios solos ni repetidos, y solo en turnos `results`; un ID que ya no está en el catálogo no rechaza la petición. El documento pasa a `version: 2`, con `shownPlaceIds` opcional en `results`. Un documento `version: 1` se abre con todos sus mensajes y se reescribe de inmediato como `version: 2` con el mismo contenido; sus resultados no tienen lista. Cualquier otra versión sigue el procedimiento de permiso de B1. La migración se propone y se revisa antes de autorizarla; no borra ni convierte datos en silencio. Los turnos `conversation`, `clarification`, `no_matches` y `answer` no cambian. Esta ficha no crea pantalla.

### Paso a paso

1. Antes de empezar, guarda tu trabajo de B4 (commit o copia) y anota cómo volver a él.
2. Copia en OpenCode el **prompt 1 (alcance)**. El agente explica y no edita.

   ```text
   Vamos a trabajar únicamente en D2·B4a.1. Lee AGENTS.md, la ficha D2·B4a.1 en
   docs/day-2/b4a.md, docs/day-2/contextual-interpretation-contract.md,
   secciones «Definiciones» y «Turno compacto, historial y documento guardado»,
   y docs/day-2/persistence-contract.md. Objetivo: guardar shownPlaceIds en los
   turnos results, validarlo en API y frontend, y pasar el documento local a
   version 2 abriendo los documentos version 1 sin perder datos. Contrasta con
   mi implementación de B4 y localiza los archivos equivalentes. No toques
   conversaciones reales. Todavía no edites ni ejecutes cambios. Explícame el
   resultado observable, los archivos, las pruebas con documentos ficticios
   v1/v2, cómo proteges mis datos y cualquier decisión que falte, citando la
   sección del contrato. Espera mi autorización explícita.
   ```

3. **Revisa la respuesta.** Debe proponer pruebas para: `shownPlaceIds` válido con cero a tres IDs; cuatro, repetidos, vacíos o solo espacios rechazados; `shownPlaceIds` en un turno que no es `results` rechazado; ID que ya no está en el catálogo aceptado; `version: 2` se guarda y abre igual; `version: 1` se abre, se reescribe como `version: 2` con el mismo contenido y sus resultados quedan sin lista; otra versión sigue el permiso de B1; y regresión de los demás turnos. Todos los documentos deben ser ficticios.

   **Si el agente pregunta…**

   - Qué se valida y qué no: «Turno compacto, historial y documento guardado».
   - Cómo se migra `version: 1`: se reescribe como `version: 2` al abrir, con el mismo contenido.
   - Si puede borrar o reiniciar un documento que no reconoce: no; sigue el permiso de B1.
   - Cualquier decisión de migración no prevista: debe detenerse y reportarla.

4. Copia el **prompt 2 (autorización)**.

   ```text
   Autorizo únicamente D2·B4a.1 según el alcance que explicaste. Usa los
   archivos acordados y las reglas de
   docs/day-2/contextual-interpretation-contract.md; no agregues dependencias.
   Escribe primero las pruebas públicas con documentos ficticios v1/v2 en
   almacenamiento aislado y observa que fallen; después implementa
   shownPlaceIds, su validación y la migración a version 2, y mantén las
   comprobaciones en verde. Conserva B4 y nunca uses mis conversaciones reales.
   Si aparece una decisión de migración no acordada, detente. No llames a
   proveedores reales. No hagas commits ni push. Informa archivos, comandos,
   resultados y comprobaciones no ejecutadas, y detente antes de la siguiente
   ficha.

   Si escribes una prueba para esta ficha, guarda la salida completa de la
   corrida RED (sin head ni recortes) e informa los nombres literales de las
   pruebas que fallan. Si escribes una prueba después de implementar,
   repórtala como «RED no observado».
   ```

5. **Revisa el informe del agente.** RED antes de GREEN, por resultado y no solo por importación; total de pruebas = estado base + nuevas; documentos ficticios; `version: 1` abre sin perder mensajes; ningún dato borrado; pruebas de B4 siguen en verde.
   Si hubo RED, verifica los nombres y motivos literales, no deducidos; si no se conservó la salida completa, registra qué evidencia falta. Las pruebas escritas después de implementar se reportan como «RED no observado». Confirma que el agente no dejó worktrees, entradas de stash ni archivos temporales propios; no toques los de otras fichas.

6. **Comprueba tú**, desde la raíz. Con la API en marcha (`npm.cmd run dev:api`), envía un historial con `shownPlaceIds` en un turno que no es `results`; es inválido y no llega a Groq:

   ```powershell
   npm.cmd test
   npm.cmd run typecheck
   $body = Join-Path $env:TEMP "partyquest-chat.json"
   $prefs = '{"zone":null,"budget":null,"groupSize":null,"wantsFood":null,"nearMe":null}'
   [IO.File]::WriteAllText($body, '{"message":"Hola","history":[{"user":"Hola","pachi":{"kind":"conversation","text":"Hola","question":null,"applied":' + $prefs + ',"shownPlaceIds":["la-mula"]}}],"writtenZone":null,"preferences":' + $prefs + ',"location":null}')
   curl.exe -i -X POST http://127.0.0.1:8787/api/chat -H "Content-Type: application/json" --data-binary "@$body"
   ```

   En macOS/Linux:

   ```bash
   npm test && npm run typecheck
   curl -i -X POST http://127.0.0.1:8787/api/chat -H "Content-Type: application/json" -d '{"message":"Hola","history":[{"user":"Hola","pachi":{"kind":"conversation","text":"Hola","question":null,"applied":{"zone":null,"budget":null,"groupSize":null,"wantsFood":null,"nearMe":null},"shownPlaceIds":["la-mula"]}}],"writtenZone":null,"preferences":{"zone":null,"budget":null,"groupSize":null,"wantsFood":null,"nearMe":null},"location":null}'
   ```

   Después, en el navegador, recarga tu conversación guardada y comprueba en **Application → Local Storage** que `partyquest.conversation` tiene `"version":2` y los mismos mensajes que antes.

   **Resultado esperado:**

   | Comprobación | Resultado |
   | --- | --- |
   | Pruebas y typecheck | Código `0` |
   | `shownPlaceIds` en `conversation` | `HTTP/1.1 400` con `"code":"invalid_request"` |
   | Conversación guardada | Abre con todos sus mensajes y ahora es `version: 2` |

   **Lo que puede confundirte:**

   - Los resultados guardados antes de esta ficha no tienen lista: una referencia a ellos pedirá aclaración. Es esperado.
   - Si vuelves a una versión anterior de tu interfaz, el documento `version: 2` se tratará como incompatible.

7. Anota: «N/N pruebas; RED en `shownPlaceIds` de cuatro; v1 → v2 sin perder mensajes; 400 en turno no `results`». Si todo pasó, sigue el [checklist de Git](roadmap.md#guardar-un-punto-de-control) y haz tú el commit local: `git commit -m "D2·B4a.1 Lista mostrada y documento v2"`. Detente aquí.

---

## D2·B4a.2 — Referencia y resolución

### Datos de la ficha

- **Abre:** la interpretación y su validador (ruta probable: `api/src/features/chat/application/`).
- **También:** la preparación del historial para el modelo y el cálculo de elegibles de B4.
- **Pruebas:** pruebas públicas por `POST /api/chat` con Groq y Cohere simulados.
- **Lectura:** [contrato de interpretación contextual](contextual-interpretation-contract.md), secciones «Reglas A1–A4», «Salida de interpretación» y «Turno compacto, historial y documento guardado».

### Reglas que aplica esta ficha

La salida de interpretación agrega el campo obligatorio `reference`: `null` o `{ "target": "shown" | "unshown" | "place", "placeId": string | null }`. `shown` limita la consulta a la lista vigente (A1); `place` se refiere a un lugar de la lista (A2); `shown` y `unshown` llevan `placeId: null`; con `clarification` no nula, `reference` es `null`. Targets desconocidos, claves extra, `placeId` no textual, `shown`/`unshown` con ID y `reference` junto con `clarification`: `provider_error` (HTTP 502). `{ "target": "place", "placeId": null }` es válido y se resuelve como `place_reference`. Sin lista vigente, ID que no existe en el catálogo o `placeId` fuera de la lista: código `place_reference` con «¿A cuál de los lugares mostrados te refieres?», HTTP 200 (A4). `what_to_change` no se usa para referencias. Toda aclaración deja `searchText: null`, conserva las preferencias de la petición, no filtra ni consulta descripciones. A1: tras resultados y «… y 4 más», «esos» son los tres mostrados. A2: ordinal según el orden mostrado; nombre solo si aparece una vez en la lista. El historial para el modelo agrega, solo en el turno de la lista vigente, los lugares numerados con nombre e ID del catálogo («1. Bar El Yukt’ko (bar-el-yuktko)»), sin precios, distancias ni descripciones. Esta ficha no crea pantalla.

### Paso a paso

1. Localiza la salida de interpretación de B4 y dónde se calculan los elegibles.
2. Copia el **prompt 1 (alcance)**.

   ```text
   Vamos a trabajar únicamente en D2·B4a.2. Lee AGENTS.md, la ficha D2·B4a.2 en
   docs/day-2/b4a.md y docs/day-2/contextual-interpretation-contract.md,
   secciones «Reglas A1–A4», «Salida de interpretación» y «Turno compacto,
   historial y documento guardado». Objetivo: añadir reference a la salida de
   interpretación, validarla, resolver shown y place contra la lista vigente,
   limitar los elegibles a esos IDs y aplicar place_reference cuando no se
   pueda resolver. Conserva B4. Localiza los archivos equivalentes. Las
   pruebas usan Groq y Cohere simulados. Todavía no edites ni ejecutes
   cambios. Explícame el resultado observable, los archivos, las pruebas y
   cualquier decisión que falte, citando la sección del contrato. Espera mi
   autorización explícita.
   ```

3. **Revisa la respuesta.** Las pruebas deben cubrir los criterios 1, 2, 3, 6 y 14 del contrato: plural restringido a los IDs mostrados aunque haya más coincidencias; ordinal según orden alfabético y por distancia; nombre único, ausente y ambiguo; sin lista vigente, ID inexistente y `placeId` fuera de la lista → `place_reference` sin filtrar; `place` con ID nulo → 200; `shown` con ID → 502; cada forma inválida → 502; e historial numerado solo en el turno de la lista vigente.

   **Si el agente pregunta…**

   - Qué es la lista vigente y cuándo se borra: «Definiciones».
   - Forma y validación de `reference`: «Salida de interpretación».
   - Qué ve el modelo de la lista: «Turno compacto, historial y documento guardado».

4. Copia el **prompt 2 (autorización)**.

   ```text
   Autorizo únicamente D2·B4a.2 según el alcance que explicaste. Usa los
   archivos acordados y los textos exactos de
   docs/day-2/contextual-interpretation-contract.md; no agregues dependencias.
   Escribe primero las pruebas públicas con Groq y Cohere simulados y observa
   que fallen; después implementa reference, su validación, la resolución y
   place_reference, y mantén las comprobaciones en verde. Conserva B4 y las
   pruebas de B4. No llames a proveedores reales ni toques la interfaz. No
   hagas commits ni push. Informa archivos, comandos, resultados, contenido de
   las llamadas simuladas y comprobaciones no ejecutadas, y detente.

   Si escribes una prueba para esta ficha, guarda la salida completa de la
   corrida RED (sin head ni recortes) e informa los nombres literales de las
   pruebas que fallan. Si escribes una prueba después de implementar,
   repórtala como «RED no observado».
   ```

5. **Revisa el informe del agente.** RED antes de GREEN, por resultado y no solo por importación; total de pruebas = estado base + nuevas; elegibles limitados a la lista; `place_reference` con su texto exacto y sin filtrar; 502 en cada forma inválida; el modelo recibe solo nombre e ID de la lista vigente; pruebas de B4 en verde.
   Si hubo RED, verifica los nombres y motivos literales, no deducidos; si no se conservó la salida completa, registra qué evidencia falta. Las pruebas escritas después de implementar se reportan como «RED no observado». Confirma que el agente no dejó worktrees, entradas de stash ni archivos temporales propios; no toques los de otras fichas.

6. **Comprueba tú**, desde la raíz:

   ```powershell
   npm.cmd test --workspace api
   npm.cmd run typecheck
   ```

   En macOS/Linux:

   ```bash
   npm test --workspace api && npm run typecheck
   ```

   **Resultado esperado:**

   | Comprobación | Resultado |
   | --- | --- |
   | Referencias resueltas | A1 y A2 limitan los elegibles a la lista |
   | Referencias no resolubles | `place_reference`, HTTP 200, preferencias intactas |
   | Formas inválidas | HTTP 502 `provider_error` |
   | Pruebas y typecheck | Código `0` |

   **Lo que puede confundirte:**

   - Las pruebas simuladas fijan qué devuelve el modelo; no muestran si el modelo real entiende bien «el segundo». Eso es D2·B4a.4.
   - El ID va en el historial porque el modelo lo necesita para indicar un `place`; nunca van precios ni distancias.

7. Anota: «N/N pruebas; RED en ordinal por distancia y en ID inexistente; `place_reference` 200; `shown` con ID 502». Si todo pasó, sigue el [checklist de Git](roadmap.md#guardar-un-punto-de-control) y haz tú el commit local: `git commit -m "D2·B4a.2 Referencia y resolución"`. Detente aquí.

---

## D2·B4a.3 — Continuaciones y otras opciones

### Datos de la ficha

- **Abre:** el caso de uso del chat, en las ramas de búsqueda y de pregunta abierta.
- **También:** la instrucción de interpretación y las plantillas de resultados de B2.
- **Pruebas:** pruebas públicas por `POST /api/chat` con Groq y Cohere simulados.
- **Lectura:** [contrato de interpretación contextual](contextual-interpretation-contract.md), secciones «Reglas A1–A4» (A3), «Coincidencias no mostradas», «Lugares que ya no cumplen» y «Casos que resuelve el servidor».

### Reglas que aplica esta ficha

A3: una continuación conserva preferencias y limita el contexto a la lista vigente; una búsqueda nueva aplica B2 e invalida la lista aunque no haya coincidencias. No mostradas: coincidencias de la lista principal con las preferencias vigentes que no se mostraron en la búsqueda en curso. Una pregunta sobre «los otros» se responde entre ellas con las reglas de B4. «¿Y los otros?» sin pregunta muestra hasta tres en el mismo orden, como un `results` nuevo, empezando con «Estas son otras opciones{condiciones}:», con «(en orden alfabético)» cuando corresponde, «… y n más», la nota de distancias y la nota de fuente; repetirlo sigue avanzando. Sin no mostradas: «Ya te mostré todas las opciones que encontré{condiciones}.» como `conversation`. Si las preferencias cambiaron sin búsqueda nueva, Pachi responde sobre la lista vista y agrega «Ojo: X ya no coincide con lo que buscas ahora.», «Ojo: X y Y ya no coinciden con lo que buscas ahora.» o «Ojo: X, Y y Z ya no coinciden con lo que buscas ahora.». Referencia resoluble `place` o `shown` sin `searchText`: «¿Qué quieres saber de ese lugar?» o «¿Qué quieres saber de esos lugares?», sin filtrar. Con lista vigente y nada nuevo (sin referencia, sin pregunta, sin aclaración, mismas preferencias), se avanza de página. La instrucción indica que una descripción singular que encaja con varios lugares es ambigua, que «los demás», «los otros» y «los que no mostraste» son `unshown`, y que una pregunta sobre lugares mostrados conserva su consulta en `searchText`. Esta ficha no crea pantalla.

### Paso a paso

1. Localiza dónde tu caso de uso decide entre búsqueda, aclaración y pregunta abierta.
2. Copia el **prompt 1 (alcance)**.

   ```text
   Vamos a trabajar únicamente en D2·B4a.3. Lee AGENTS.md, la ficha D2·B4a.3 en
   docs/day-2/b4a.md y docs/day-2/contextual-interpretation-contract.md,
   secciones «Reglas A1–A4», «Coincidencias no mostradas», «Lugares que ya no
   cumplen» y «Casos que resuelve el servidor». Objetivo: distinguir
   continuación de búsqueda nueva, mostrar y consultar las coincidencias no
   mostradas, avisar cuando un lugar ya no cumple, resolver la referencia sin
   pregunta y avanzar de página sin cambios, y actualizar la instrucción de
   interpretación. Conserva B4 y D2·B4a.2. Las pruebas usan proveedores
   simulados. Todavía no edites ni ejecutes cambios. Explícame el resultado
   observable, los archivos, las pruebas y cualquier decisión que falte,
   citando la sección del contrato. Espera mi autorización explícita.
   ```

3. **Revisa la respuesta.** Las pruebas deben cubrir los criterios 4, 5, 7, 8, 9, 11, 12, 13 y 15 del contrato, con los textos completos comparados exactos: continuación y búsqueda nueva; «¿y los otros?» con y sin pregunta, repetido y agotado; mismas preferencias con otro orden de claves; aviso en singular, dos y tres lugares; referencia sin pregunta con y sin cambios propuestos; avance de página sin lista vigente; y regresión de los demás turnos.

   **Si el agente pregunta…**

   - Qué cuenta como búsqueda en curso: «Definiciones».
   - Textos de otras opciones y agotamiento: «Coincidencias no mostradas».
   - Si debe quitar en silencio los lugares que ya no cumplen: no; se avisa («Lugares que ya no cumplen»).
   - Si puede copiar ejemplos de evaluación en la instrucción: no; las reglas son genéricas.

4. Copia el **prompt 2 (autorización)**.

   ```text
   Autorizo únicamente D2·B4a.3 según el alcance que explicaste. Usa los
   archivos acordados y los textos exactos de
   docs/day-2/contextual-interpretation-contract.md; no agregues dependencias.
   Escribe primero las pruebas públicas con proveedores simulados y observa que
   fallen; después implementa las continuaciones, las coincidencias no
   mostradas, el aviso de lugares que ya no cumplen, la referencia sin
   pregunta, el avance de página y la instrucción, y mantén las comprobaciones
   en verde. Conserva B4 y D2·B4a.2. No llames a proveedores reales ni toques
   la interfaz. No hagas commits ni push. Informa archivos, comandos,
   resultados y comprobaciones no ejecutadas, y detente.

   Si escribes una prueba para esta ficha, guarda la salida completa de la
   corrida RED (sin head ni recortes) e informa los nombres literales de las
   pruebas que fallan. Si escribes una prueba después de implementar,
   repórtala como «RED no observado».
   ```

5. **Revisa el informe del agente.** RED antes de GREEN, por resultado y no solo por importación; total de pruebas = estado base + nuevas; textos exactos; «¿y los otros?» nunca repite lugares de la búsqueda en curso; el aviso no excluye lugares; regresión de B4 en verde.
   Si hubo RED, verifica los nombres y motivos literales, no deducidos; si no se conservó la salida completa, registra qué evidencia falta. Las pruebas escritas después de implementar se reportan como «RED no observado». Confirma que el agente no dejó worktrees, entradas de stash ni archivos temporales propios; no toques los de otras fichas.

6. **Comprueba tú**, desde la raíz:

   ```powershell
   npm.cmd test --workspace api
   npm.cmd run typecheck
   ```

   En macOS/Linux:

   ```bash
   npm test --workspace api && npm run typecheck
   ```

   **Resultado esperado:**

   | Comprobación | Resultado |
   | --- | --- |
   | «¿Y los otros?» | Hasta tres nuevas; repetido no repite; agotado → texto exacto |
   | Lugares que ya no cumplen | Responde sobre la lista vista con el aviso correcto |
   | Pruebas y typecheck | Código `0` |

   **Lo que puede confundirte:**

   - Con la regla de avance de página, «gracias» después de una lista muestra la página siguiente. Es un límite conocido del contrato.
   - La lista solo cubre la ventana de seis intercambios: una página más antigua puede volver a mostrarse.

7. Anota: «N/N pruebas; RED en agotamiento y en aviso de dos lugares; regresión B4 en verde». Si todo pasó, sigue el [checklist de Git](roadmap.md#guardar-un-punto-de-control) y haz tú el commit local: `git commit -m "D2·B4a.3 Continuaciones y otras opciones"`. Detente aquí.

---

## D2·B4a.4 — Revisión en navegador y evaluación real

### Datos de la ficha

- **Abre:** tu aplicación en el navegador y tu registro personal `notes/day-2-progress.md`.
- **También:** la conversación guardada de B4a.1.
- **Pruebas:** las pruebas deterministas de B4a.1 a B4a.3; esta ficha no las sustituye.
- **Lectura:** [contrato de interpretación contextual](contextual-interpretation-contract.md), secciones «Evaluación real separada» y «Límites conocidos».

### Reglas que aplica esta ficha

La interfaz no cambia: los seguimientos se ven en las burbujas existentes. Mensajes en `role="log"` con `aria-live="polite"`, errores en `role="alert"`, avisos bajo el campo, fila del composer estable, columna de hasta 480 px, texto de 16 px, controles de al menos 44 px y foco visible. La calidad de la interpretación solo se observa con el modelo real y requiere tu autorización de llamadas y cuota; sin ella, «No evaluado». Si la autorizas: escribe antes las preguntas para A1–A4 y lo esperado de cada una (qué debió entender y si debió responder, aclarar o buscar), fija el umbral antes de medir, no reintentes automáticamente y registra los fallos del proveedor. No cambies preguntas ni umbral después de ver resultados.

### Paso a paso

1. Decide si autorizas llamadas reales. Sin ellas, revisa en el navegador lo que no requiere enviar mensajes (la conversación restaurada) y registra el resto como «No evaluado».
2. Si las autorizas, pide el protocolo con el **prompt 1 (alcance)**:

   ```text
   Vamos a trabajar únicamente en D2·B4a.4, evaluación real separada. Lee
   AGENTS.md, la ficha D2·B4a.4 en docs/day-2/b4a.md y
   docs/day-2/contextual-interpretation-contract.md, secciones «Evaluación real
   separada» y «Límites conocidos». No hagas llamadas ni accedas a cuentas.
   Propón preguntas para A1, A2, A3 y A4 con lo esperado de cada una, el
   umbral que fijaré antes de medir, el número total de llamadas y cómo
   registro los resultados sin exponer claves. Separa lo que fija el contrato
   de lo que propones tú. Espera mi autorización explícita.
   ```

3. **Revisa la respuesta.** Rechaza un plan que fije lo esperado o el umbral después de ver resultados, que reintente o que no diga cuántas llamadas hará.
4. Solo si autorizas las llamadas, copia el **prompt 2 (autorización)**:

   ```text
   Autorizo únicamente la evaluación real D2·B4a.4 con mi cuenta de Groq y el
   número de llamadas que aprobamos. Antes de llamar, registra en mi registro
   personal las preguntas, lo esperado y el umbral, y no los cambies después.
   No reintentes, no cambies código, no instales dependencias y no hagas
   commits. Usa las claves solo desde el entorno del backend y no las
   imprimas. Informa por pregunta lo que entendió Pachi, si respondió, aclaró
   o buscó, si cumple lo esperado y el consumo informado. Si no puedes
   comprobar alguna autorización, detente y reporta «No evaluado».
   ```

5. **Revisa el informe del agente.** Respeta el número de llamadas; separa lo observado de lo esperado; no afirma calidad general.
6. **Comprueba tú** en el navegador, a unos **360 px** y en escritorio: una lista de resultados, un «¿cuál de esos…?», un «¿el segundo…?» y una referencia ambigua. Las respuestas se leen completas en las burbujas existentes, los avisos aparecen bajo el campo y el composer no cambia.

   **Resultado esperado:**

   | Comprobación | Resultado |
   | --- | --- |
   | Conversación restaurada | Abre con todos sus mensajes |
   | Seguimientos (si los autorizas) | Cada pregunta cumple lo esperado, o se registra como fallo |
   | Referencia ambigua | «¿A cuál de los lugares mostrados te refieres?» o se registra el fallo |
   | Interfaz | Igual que antes a 360 px y escritorio |
   | Sin autorización | «No evaluado» |

   **Lo que puede confundirte:**

   - En la evaluación del taller, el modelo real no alcanzó el umbral: puede responder sobre un lugar que la persona no eligió. Si te pasa, es un hallazgo que se registra, no un error de tu código.
   - HTTP 200 no significa que Pachi entendió bien.

7. Anota por pregunta lo esperado, lo obtenido y si pasa, o «No evaluado», y la revisión visual. Si todo pasó, sigue el [checklist de Git](roadmap.md#guardar-un-punto-de-control) y haz tú el commit local: `git commit -m "D2·B4a.4 Revisión y evaluación real"`. Detente aquí. Siguiente bloque: [B5](b5.md).

# Contrato de streaming y voz de Pachi — D2·B5

Este contrato define el transporte por eventos y la voz de Pachi de B5. No contiene solución de referencia. Las [fichas de B5](b5.md) ordenan el trabajo; leer el contrato no autoriza implementación, llamadas reales ni publicación.

## Alcance y compatibilidad

B5 conserva las reglas de B1–B4a: validación, interpretación contextual, resultados, evidencia, selección, citas literales, compactos y manejo de datos. El endpoint sigue siendo `POST /api/chat` con el mismo cuerpo. El JSON exitoso mantiene `reply`, `model`, `usage`, `compact` y `preferences`; la línea de voz aprobada se antepone a `reply`, tanto en JSON como en eventos. Compacto, citas y fuentes no cambian. El streaming no transmite tokens ni salida sin validar.

## Negociación

Si cualquier elemento de la lista `Accept` es `text/event-stream`, ignorando mayúsculas y parámetros, responder en `Content-Type: text/event-stream`. Los errores detectados antes de iniciar el stream conservan HTTP y cuerpo JSON existentes. Cualquier otro `Accept` conserva sin cambios respuesta JSON. El cliente usa `fetch` y `ReadableStream`, no `EventSource`.

## Formato de eventos

Cada frame contiene exactamente `event: <nombre>`, `data: <JSON>` y línea vacía. Los eventos permitidos:

| Evento | Datos exactos y regla |
|---|---|
| `stage` | `{"id":"interpreting"}`, `{"id":"searching_places"}` o `{"id":"reading_descriptions"}`; solo al comenzar realmente esa fase y en orden real. |
| `content` | `{"text":"..."}`; solo tras componer y validar la respuesta completa. Al concatenar todos los `text`, se obtiene exactamente el `reply` JSON, incluidos espacios y saltos de línea. |
| `final` | `{"model":"...","usage":...,"compact":...,"preferences":...}` con las formas y valores de la respuesta JSON vigente. Sigue a todo `content`. |
| `error` | `{"code":"...","retryable":true}` usando valores reales del error vigente; no incluye mensaje ni texto crudo del proveedor. No contiene contenido parcial. |

Un stream activo termina con exactamente un terminal (`final` o `error`) y no emite eventos después. No se anuncian etapas omitidas. Una desconexión/cancelación detiene trabajo y eventos; si no se puede detener inmediatamente una operación, su resultado tardío se descarta antes de iniciar el siguiente paso.

## Validación del cliente y persistencia

El cliente valida frame, nombre de evento, JSON, claves y tipos; no combina varias líneas `data` ni ignora campos extra. Acepta lecturas fragmentadas, varios frames por lectura y caracteres UTF-8 divididos entre lecturas. Solo `final` válido seguido de cierre limpio es éxito. Evento desconocido/mal formado, JSON o forma inválidos, EOF sin terminal, cualquier evento tras `final`, error terminal o aborto no son éxito. `error` conserva código y retryability, pero contenido previo nunca completa la respuesta. Cancelar prevalece sobre lecturas/eventos tardíos.

Solo el éxito completo agrega y guarda el mensaje de Pachi, texto reconstruido y compacto. Una respuesta interrumpida, cancelada, mal formada o terminada en error nunca se guarda como completa; se conserva el mensaje de la persona y se ofrece el flujo existente «Reintentar» / «Editar mensaje» sin duplicar su burbuja. No afirmes que abortar evita cobro del proveedor. Reintentar es manual y puede consumir cuota.

## Cancelación y errores

Durante respuesta se ofrece «Detener». Aborta la petición; el servidor propaga cancelación a Groq/Cohere, no inicia pasos nuevos y descarta resultados tardíos no cancelables. La cancelación no equivale a fallo del proveedor. Después del inicio solo se usan los códigos existentes `configuration_error`, `quota_exceeded`, `provider_error` e `internal_error`; `invalid_request` ocurre antes del stream. `retryable` conserva el valor del error JSON vigente. Nunca exponer texto del proveedor, detalles ni stack traces. La interfaz reutiliza el aviso y acciones existentes; la voz no los reemplaza.

## Voz aprobada

La voz es optimista, amable y honesta; no fuerza bromas ni presiona a gastar. Las situaciones que decide el servidor llevan una línea de apertura breve, una línea vacía y el texto actual intacto. No se repiten datos ni se alteran citas/fuentes. La apertura está en `reply` pero no en compacto; por eso no entra al historial. Errores e interrupciones se expresan en UI junto al aviso/acciones existentes.

Se elige variante de forma determinista: suma de unidades UTF-16 del mensaje recortado (trim), módulo número de variantes. Mismo mensaje y estado producen la misma variante. Prioridad: aclaración B4a; dato faltante; sin evidencia; sin opciones; cambio de idea; propuesta. «Sin opciones» prima sobre cambio de idea cuando coinciden.

| Situación | Variantes exactas |
|---|---|
| Propuesta | «¡Ya tengo algunas opciones para revisar!» / «Aquí tienes algunas opciones para comparar.» |
| Dato faltante | «Para seguir sin adivinar, necesito aclarar algo.» / «Ayúdame con un detalle.» |
| Cambio de idea | «Entendido, cambiamos el plan.» / «De acuerdo, busco con lo que me acabas de decir.» |
| Sin opciones | «No pasa nada, todavía podemos ajustar el plan.» / «Probemos con otra combinación.» / «Si cambiamos un detalle, quizá aparezca algo.» |
| Sin evidencia | «Prefiero decirte la verdad.» / «No quiero completar ese dato con una suposición.» / «Aquí no quiero inventar nada.» |
| Error (UI) | «Perdón, algo falló de mi lado.» / «Lo siento, esta vez no pude responder.» |
| Interrupción (UI) | «La respuesta se interrumpió antes de terminar.» / «No tengo una respuesta completa para este mensaje.» |
| Aclaración B4a | «Quiero asegurarme de entenderte bien.» / «Antes de responder, una pregunta rápida.» |

No se inventan hechos, disponibilidad, precios ni lugares; no se celebra un error, no se presiona a gastar, no se dice que se está buscando si no comenzó búsqueda, no se repite un dato resuelto y no se reescribe una cita.

## Reglas de interfaz

Reutiliza `Composer`, burbujas, indicador de espera e `InlineNotice`; no crees un segundo chat. Presentación representa etapas/eventos y acciones; hook gestiona estado/cancelación; cliente parsea/valida protocolo y DTO; API/core coordina sin depender de UI. Composer no llama a la API ni persiste. «Detener» aparece mientras responde. Mensajes nuevos usan `role="log"` y `aria-live="polite"`; errores `role="alert"`. Acciones con nombre accesible, objetivos táctiles de al menos 44×44 px, aviso bajo el campo, fila estable y ancho utilizable. Con `prefers-reduced-motion: reduce`, se detienen animaciones continuas y el estado se comunica con texto. Revisa visualmente estados válido, error, interrupción/cancelación, reintento y respuesta tardía a ~360 px y escritorio; pruebas automatizadas no sustituyen esta comprobación.

## Pruebas y límites

Preparar pruebas públicas con proveedores simulados: stream válido (orden real, etapas omitidas, concatenación exacta y final igual a JSON); frames/JSON/formas inválidas y EOF; errores seguros; cancelación y descarte de resultados tardíos; compatibilidad JSON; voz por situación, prioridad y variante. Las pruebas se escriben y se ejecutan en cada ficha (RED antes de GREEN); preparar una prueba no equivale a ejecutarla. No se requieren llamadas reales; cualquier llamada a Groq/Cohere exige autorización específica y se reporta «No evaluado» si no se hace.

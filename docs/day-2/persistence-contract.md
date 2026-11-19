# Contrato de persistencia de la conversación — Día 2, B1

Este contrato describe el estado local de la conversación activa y cómo B1 lo valida, guarda y usa para construir peticiones. Es una referencia para implementar el ejercicio; no incluye una solución.

## Alcance

La conversación activa y la zona escrita sobreviven recargas en el mismo navegador mediante `localStorage`. No hay cuentas, sincronización, archivo de planes ni vencimiento automático. El almacenamiento local no está cifrado. No guardes información privada. Este contrato no autoriza implementar B2 ni bloques posteriores.

## Documento guardado, versión 1

La clave es `partyquest.conversation`. El valor es JSON con exactamente estos cuatro campos obligatorios; no se aceptan campos desconocidos:

```json
{
  "version": 1,
  "writtenZone": null,
  "preferences": {
    "zone": null,
    "budget": null,
    "groupSize": null,
    "wantsFood": null,
    "nearMe": null
  },
  "messages": []
}
```

`version` es el número `1`, no la cadena `"1"`. `writtenZone` es texto o `null`; `messages` es un arreglo, incluso cuando está vacío. En B1, `preferences` siempre contiene esas cinco claves, todas en `null`; B1 no las infiere ni las envía. Las formas con valores activos se usan a partir de B2.

Cada elemento de `messages` tiene exactamente una de estas formas:

- Persona: `{ "role": "user", "text": "…" }`.
- Pachi: `{ "role": "pachi", "text": "…", "compact": TurnoCompacto }`.

Los mensajes alternan estrictamente empezando por la persona; el arreglo puede terminar en un mensaje de persona. El texto de la persona y el de Pachi no pueden quedar vacíos tras recortar espacios. Pachi conserva el texto visible y el `compact` recibido: en B1 es `kind: "conversation"`, con `text` (texto no vacío; en B1 coincide con la respuesta), `question: null` y `applied` con las cinco preferencias en `null`. No reconstruyas `compact` a partir del texto. **No valides que `compact.text` sea igual al texto visible:** desde B5 el texto visible lleva antes una línea de voz de Pachi que el compacto no tiene. En B1 el validador acepta solo `kind: "conversation"`, pero debe poder ampliarse: B2 añade `clarification`, `results` y `no_matches`, y B4 añade `answer`, sin cambiar `version: 1`.

Al guardar, recorta espacios iniciales y finales de los mensajes de persona y de `writtenZone`; zona vacía o solo espacios pasa a `null`. Al cargar, esos espacios exteriores se admiten; para validar longitud y contenido se considera el texto recortado, sin cambiar silenciosamente el contenido restaurado. Una `writtenZone` que no es `null` debe quedar no vacía después de recortarla; una zona guardada solo con espacios vuelve inválido el documento. Texto de persona: máximo 2.000 unidades UTF-16. Zona: máximo 200. Pachi no tiene límite individual adicional.

## Validación y recuperación

Parsea y valida el documento completo antes de usarlo como estado o incluirlo en una petición. JSON malformado, campos ausentes o extra, forma inválida de preferencias/mensajes/compacto, secuencia incorrecta, texto vacío o límite excedido vuelven inválido el documento. Una versión diferente de 1 es incompatible. No migres automáticamente, no uses el documento inválido como contexto y no lo sobrescribas sin permiso.

- Si no hay documento guardado, inicia vacío, sin aviso ni confirmación.
- Si el documento es inválido o incompatible, solicita confirmación con «¿Empezar una conversación nueva?» y «No pude abrir la conversación guardada. Si empiezas una nueva, la reemplazará.» Ofrece «Cancelar» y «Empezar una nueva». Cancelar conserva el valor original intacto; permite una conversación temporal que no se guarda y muestra «Conversación temporal» / «Se perderá al recargar.»
- El documento serializado completo (JSON.stringify del documento) no puede exceder 200.000 unidades UTF-16. Si cargarlo excede el límite, es inválido; si el estado nuevo lo excede al guardarse, se conserva en memoria con el aviso de fallo de guardado. No trunques ni borres mensajes automáticamente.

## Persistencia y errores

Guarda y restaura con `localStorage`, sin vencimiento, hasta confirmar «Nuevo plan» o borrar los datos del sitio. Guarda solo mensajes, zona escrita y preferencias según su etapa; nunca coordenadas precisas.

Mientras se trabaja en B1.2, la API de D1 todavía no devuelve `compact`; lo incorporará B1.3. Es válido guardar el mensaje de la persona mientras espera respuesta. Si después llega una respuesta sin `compact`, muéstrala en memoria: no inventes el compacto ni vuelvas a escribir o borrar la clave para guardar solo los mensajes anteriores. Esto también aplica al reintento manual: si el estado actual no se puede guardar completo, el valor anterior y cualquier aviso de guardado activo permanecen. No añadas un aviso nuevo por la falta de `compact`.

Si una escritura falla o el documento excede el límite, continúa en memoria y muestra el aviso persistente «No pude guardar la conversación» / «Puedes seguir conversando, pero si recargas o cierras la página se perderá lo que no se guardó.» La acción es «Reintentar guardado», manual. No reintentes automáticamente; quita el aviso solo después de guardar correctamente el estado actual. No afirmes que el estado quedó guardado antes de confirmarlo.

Si falla el borrado al confirmar «Nuevo plan», inicia un plan temporal en memoria sin guardarlo sobre el documento anterior y muestra «No pude borrar la conversación anterior» / «Esta conversación no se guardará. Si recargas la página, se perderá y podría volver a aparecer la anterior.» El aviso permanece durante ese plan temporal.

## Petición, contexto e historial

En B1, `POST /api/chat` recibe `{ "message": string, "history": [{ "user": string, "pachi": TurnoCompacto }] }`. En B1.3 `history` es opcional; si falta equivale a `[]`, mientras el cliente aún no lo envía. La API reenvía al proveedor, en una sola llamada, el prompt de sistema y luego, por cada par en orden, un turno `user` con `user` y uno `assistant` con `pachi.text`; al final agrega el mensaje actual. No recorta ni añade texto. En B1.3 la API valida la forma, no el número de pares ni el presupuesto: B2 agrega el máximo de seis pares en la API y el presupuesto de 24.000 unidades UTF-16 lo aplica el cliente desde B1.4. No envíes `writtenZone`, `preferences`, `location`, coordenadas, identificadores de usuario/sesión ni credenciales en B1. El servidor no conserva conversaciones entre peticiones.

El mensaje actual admite hasta 2.000 unidades UTF-16. **Esto cambia la regla del Día 1**, que contaba 2.000 puntos de código: desde B1 el composer y la API cuentan unidades UTF-16 (un emoji fuera del plano básico ocupa dos), así que un mensaje de 1.001 emoji ya no es válido. El historial contiene como máximo los seis pares completos más recientes. Su presupuesto máximo es 24.000 unidades UTF-16, contando únicamente el texto de usuario y el `compact.text` de Pachi de los pares previos enviados; el mensaje actual no cuenta en ese presupuesto. No confundas UTF-16 con puntos de código, bytes o tokens: un emoji fuera del plano básico suele ocupar dos unidades UTF-16.

Si el historial excede el presupuesto, retira de la petición pares completos empezando por los más antiguos, hasta que quepa. No elimines esos mensajes de la vista ni del documento local, no cortes un par por la mitad y no reenvíes automáticamente. Si tampoco cabe el par completo más reciente, envía `history: []` y muestra para esa petición «Envié tu mensaje sin el contexto anterior» / «La conversación previa era demasiado larga. Sigue visible aquí, pero Pachi no la tendrá en cuenta para esta respuesta.»

## Envío interrumpido y «Nuevo plan»

Si el último mensaje guardado es de la persona, al recuperar se considera un envío interrumpido o una respuesta no guardada completa; no afirmes que el servidor falló. Muestra «No tengo la respuesta a este mensaje» / «El envío se interrumpió antes de guardar una respuesta. Reinténtalo o edítalo para continuar.» y ofrece «Reintentar» o «Editar mensaje». Bloquea mensajes nuevos hasta resolverlo. No dupliques la burbuja. Ambas acciones son manuales; reintentar crea una petición nueva y puede consumir cuota. Editar no envía y conserva el mensaje original hasta enviar la edición; al enviar, reemplaza el original en el mismo lugar. Si se recarga antes del envío editado, vuelve a recuperarse el original como interrumpido.

«Nuevo plan» con avance pide confirmación: «¿Empezar otra conversación?» / «Esta se borrará.»; botones «Cancelar» / «Empezar otra conversación». Cancelar no cambia nada. Confirmar borra mensajes y zona e invalida respuestas pendientes; no archiva ni traslada datos del plan anterior. La preferencia de apariencia se guarda por separado y permanece. Las preferencias activas no se trasladan: se usan a partir de B2.

## Privacidad y métricas

No registres mensajes, zona escrita, coordenadas ni credenciales en logs. El servidor registra solo métricas mínimas: modelo, tokens cuando existan y resultado. Si falta `usage`, es desconocido/ausente, nunca cero. Las métricas mínimas y la ausencia de datos sensibles aplican a B1; su integración exacta pertenece a los límites de servidor del bloque.

## Reglas de interfaz para estos estados

Reutiliza `ChatPage`, `MessageList`/burbujas, `Composer`, `InlineNotice` y `ConfirmDialog` existentes. El modelo/hook coordina estado y persistencia; los componentes presentan el estado y emiten acciones; el cliente HTTP valida DTO; la API aplica su caso de uso. No pongas persistencia ni red dentro de `Composer`.

Mantén una columna de chat de hasta 480 px, `TopBar` de 56 px, composer fijo abajo con área segura, texto de 16 px, controles táctiles de al menos 44 × 44 px y foco visible. Los avisos van debajo del campo, nunca dentro de la fila de controles. La lista usa `role="log"` y `aria-live="polite"`. Con `prefers-reduced-motion: reduce`, detén animaciones continuas y comunica el estado con texto. En diálogo de confirmación usa `role="alertdialog"`, foco inicial en «Cancelar», y no ocultes contenido esencial. El texto de cada estado coincide exactamente con este contrato; color nunca es la única señal. Revisa cada estado en navegador a unos 360 px y en escritorio; las pruebas no sustituyen esa revisión.

## Reglas posteriores

La persistencia de preferencias activas y su envío con cada petición se usa a partir de B2. Tipos compactos de filtrado y datos adicionales de respuestas posteriores pertenecen a bloques siguientes; no los implementes en B1. Formatos/versiones posteriores (incluidas versiones 2 y campos opcionales de resultados) no forman parte del contrato B1 y requieren su propio contrato.

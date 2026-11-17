# Referencia de interfaz de PartyQuest — Día 1

Esta referencia delimita las vistas que hacen falta para construir E1 y cómo se componen con los componentes aprobados. Es una **vista única de chat con estados y superposiciones**, no una colección de páginas navegables. Usa el sistema de diseño aprobado (referencia de autoría no incluida en este paquete) y su visualización interactiva (referencia de autoría no incluida en este paquete); no introduce un rediseño.

La galería visual reducida está en [`interface-reference.html`](interface-reference.html). Los datos de ejemplo allí son ficticios y sirven solo para mostrar disposición.

## Qué implementar en D1

Implementa una pantalla de chat cuyas piezas cambian según el estado. Las primeras nueve muestras describen estados o variantes visuales, no nueve rutas; la décima muestra el menú de D1:

| Ref. | Estado o variante | Composición visible | Qué demuestra |
| --- | --- | --- | --- |
| D1-01 | Conversación nueva | `TopBar`, saludo de Pachi, `Composer` vacío | Entrada al chat: «¿Qué se arma hoy?»; Enviar deshabilitado cuando el texto está vacío. |
| D1-02 | Mensaje escrito | `TopBar`, saludo, `Composer` con texto | El campo permite editar y enviar el mensaje actual. |
| D1-03 | Enviando | `MessageBubble` de la persona y `MessageBubble` de espera | «Revisando opciones…»; no iniciar reintentos automáticos. |
| D1-04 | Respuesta y consumo | Mensajes de persona/Pachi y `UsagePanel` | Respuesta visible; usage completo muestra tokens y costo estimado cuando hay tarifa. |
| D1-05 | Respuesta con usage parcial o ausente | Mismos mensajes y `UsagePanel` | La respuesta se conserva; el consumo indica incompleto o no disponible, nunca cero inventado. |
| D1-06 | Ubicación | `LocationPrompt` y campo para zona escrita | Permiso o alternativa manual; la zona/coordenadas no se envían a la API ni al prompt en D1. |
| D1-07 | Error recuperable | `InlineNotice` de error y acciones | Mensaje comprensible, «Reintentar» manual y «Editar mensaje»; conversación visible en esta página. |
| D1-08 | Cuota agotada | `InlineNotice` de error | Explica el límite, conserva los mensajes visibles y no ofrece «Reintentar». |
| D1-09 | Confirmar «Nuevo plan» | `ConfirmDialog` sobre el chat | «¿Empezar otra conversación? Esta se borrará.»; cancelar conserva la sesión y confirmar limpia el estado local descrito en E1. |

`MenuSheet` también forma parte del shell visual. En la décima muestra, «Historial y favoritos» aparece deshabilitado, sin explicación adicional: el comportamiento de historial no pertenece a este día. Debajo está «Apariencia» («Claro», «Oscuro», «Sistema»), que llega **ya funcionando** con el starter: «Sistema» sigue la preferencia del sistema operativo y una elección explícita se guarda en el navegador (sistema de diseño, §7.2 (referencia de autoría no incluida en este paquete)). No se construye en D1 ni se borra con «Nuevo plan».

El flujo de usuario (referencia de autoría no incluida en este paquete) y E1 definen el comportamiento; esta matriz selecciona solo las situaciones visuales que aplican a D1. Las 22 muestras de la visualización global no son una lista de entregables para este incremento.

## Componentes y responsabilidades

La pantalla se divide por responsabilidades. Los nombres bajo «Componente» son nombres recomendados para organizar el código React; la forma visual se toma del sistema aprobado. No hace falta crear un componente para cada etiqueta HTML.

| Componente | Responsabilidad | Datos y eventos que necesita | No debe hacer |
| --- | --- | --- | --- |
| `ChatPage` | Componer la vista de chat y sus estados | Mensajes, estado de envío, estado de error, estado/consumo de sesión; acciones de enviar, reiniciar y cambiar ubicación | Implementar dentro de cada pieza visual el acceso a Groq o duplicar lógica de estado. |
| `TopBar` | Mostrar marca de Pachi y acciones globales de D1 | Acción «Nuevo plan»; apertura del menú | Enviar mensajes o llamar a la API. |
| `MessageList` | Ordenar y presentar los intercambios visibles | Lista ordenada de mensajes; `MessageBubble` representa cada elemento | Enviar turnos anteriores a la API en D1. |
| `MessageBubble` | Presentar un mensaje de persona, Pachi o espera | Emisor, texto y variante visual | Llamar a la API, decidir errores o inferir usage. |
| `Composer` | Editar y emitir el mensaje actual | Texto, `disabled` durante envío y evento de enviar | Guardar historial o llamar directamente a Groq. En D1 no incluye voz. |
| `InlineNotice` | Mostrar error con contexto y acciones | Tono, título, explicación y acciones permitidas | Mostrar `error.message` técnico o credenciales. |
| `LocationPrompt` | Presentar permiso y alternativa de zona | Estado del permiso, eventos de solicitar ubicación/escribir zona | Enviar coordenadas o zona a la API durante D1. |
| `UsagePanel` | Mostrar usage y costo estimado o su estado incompleto | `usage`, modelo/tarifa disponible y acumulado de la sesión | Solicitar usage al proveedor ni inventar valores faltantes. |
| `ConfirmDialog` | Confirmar el reinicio destructivo de la conversación visible | Estado abierto, texto y eventos confirmar/cancelar | Borrar historial/favoritos, cambiar permisos o cuotas. |
| `MenuSheet` | Mostrar la hoja visual del menú y el selector «Apariencia» entregado con el shell | Estado abierto/cerrado; acción cerrar | Habilitar historial y favoritos en D1. |

El slice `chat` coordina envío, espera, respuesta, errores, usage y reinicio. Los componentes reciben datos y emiten acciones; el cliente HTTP conoce el contrato y el adaptador servidor conoce Groq. La [guía de arquitectura D1](../architecture.md) detalla esos límites.

## Composición de la pantalla

```text
ChatPage
├── TopBar
│   └── MenuSheet (historial deshabilitado en D1; «Apariencia» entregada con el shell)
├── MessageList
│   └── MessageBubble (persona / Pachi / esperando)
├── LocationPrompt (solo cuando corresponde)
├── InlineNotice (error recuperable o cuota agotada)
├── UsagePanel (siempre en la franja inferior D1; estados completo/parcial/no disponible)
├── Composer (sin micrófono)
└── ConfirmDialog (superpuesto al confirmar «Nuevo plan»)
```

El chat se mantiene en una columna centrada de hasta 480 px. La `TopBar` fija mide 56 px; el campo queda fijo al pie y respeta el área segura del dispositivo. En escritorio se conserva la columna; no se agregan paneles laterales. Los componentes reutilizan tokens, radios, tamaños, botones y accesibilidad del sistema visual aprobado.

## Qué llega preparado y qué construye el estudiante

| Llega como presentación/plantilla | Lo construye el estudiante en E1 |
| --- | --- |
| Tokens, layout, Pachi, componentes visuales y las vistas de esta referencia | Estado real del chat, envío por el cliente HTTP, respuesta visible y coordinación de estados |
| Variantes visuales de espera, error, cuota, ubicación, consumo y confirmación | Manejo del resultado del contrato, consumo completo/parcial y eventos de «Nuevo plan» |
| `Composer` sin voz y `MenuSheet` con el acceso futuro deshabilitado | Validación del envío en la UI y conexión de controles a las acciones del incremento |

Las plantillas no deben ocultar una llamada a Groq, una gestión real del historial ni lógica funcional resuelta.

## Revisión de fidelidad y alcance

- [ ] La composición usa el HTML global aprobado como fuente visual; no se agregan colores, tipografía o variantes nuevas.
- [ ] Solo aparecen controles y estados del alcance D1 de esta matriz.
- [ ] `TopBar`, `Composer`, burbujas, avisos, ubicación, consumo, menú y diálogo tienen límites identificables.
- [ ] Respuesta válida sin usage sigue visible; el panel no presenta `null` como cero.
- [ ] El mensaje de error D1 dice que la conversación sigue visible en esta página; no afirma que persista al recargar.
- [ ] El permiso de ubicación no implica clasificación municipal y no filtra datos a la API.
- [ ] «Nuevo plan» no borra permisos, cuota del proveedor, historial ni favoritos.
- [ ] Los estados usan mensajes accesibles y todas las acciones conservan foco visible y área táctil aprobada.

## Referencias

- Sistema de diseño de PartyQuest (referencia de autoría no incluida en este paquete), especialmente secciones 4, 7, 8, 9 y 11.
- Visualización del sistema de diseño (referencia de autoría no incluida en este paquete), pestaña «Pantallas» y modos claro/oscuro.
- Flujo de usuario (referencia de autoría no incluida en este paquete), secciones 4.1, 4.3, 4.4, 4.9 y 5.1.
- [Especificación E1](../01-chat-integration.md).
- [Contrato D1 de la API](../api-contract.md).

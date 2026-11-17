# Arquitectura de PartyQuest para el Día 1

PartyQuest organiza el comportamiento por funcionalidad (**Vertical Slice**) y hace explícitas sus capas (**Clean Architecture**): presentación, aplicación e infraestructura. El flujo de ejecución puede entrar por HTTP y salir hacia Groq; la dirección de dependencias apunta hacia los tipos propios de la aplicación. La separación debe ayudar a localizar y probar el comportamiento, no agregar capas por ceremonia.

La [referencia de pantallas y componentes D1](day-1/interface-reference.md) define los estados visibles y las responsabilidades de presentación; su [galería HTML](day-1/interface-reference.html) permite revisar la composición sin ejecutar la aplicación. Son referencias derivadas del sistema visual aprobado (fuente de autoría: `03-design-system.md`), no un rediseño.

## Guía rápida

1. La interfaz de chat llama al cliente HTTP de la funcionalidad `chat`.
2. El cliente HTTP habla con la API propia mediante el contrato entregado.
3. La ruta HTTP de la API valida la solicitud y llama al caso de uso de `chat`.
4. El caso de uso solicita una respuesta mediante un puerto; el adaptador de Groq implementa ese puerto.
5. La respuesta vuelve por la ruta HTTP, se adapta al contrato y llega a la interfaz.

```text
Frontend                         API
┌─────────────────────┐          ┌──────────────────────┐
│ chat UI             │          │ chat HTTP route      │
│       ↓             │          │       ↓              │
│ chat API client ────┼─HTTP─────┼→ chat use case       │
└─────────────────────┘          │       ↓ port         │
                                 │ Groq adapter → Groq │
                                 └──────────────────────┘
```

La API es la única que conoce la credencial de Groq. La respuesta externa de Groq se normaliza en el servidor antes de responder al navegador.

## Estructura orientativa

La raíz técnica del proyecto es `partyquest/`; `starter` nombra la entrega inicial, no una subcarpeta. `frontend/` y `api/` son workspaces npm separados, declarados en el `package.json` de la raíz. Se mantiene un solo `package-lock.json` en esa raíz; no se crean lockfiles independientes en las aplicaciones.

```text
partyquest/
├── package.json                # Manifiesto raíz; declara los workspaces
├── package-lock.json           # Único lockfile del proyecto
├── frontend/
│   └── src/                     # Aplicación React
└── api/
    └── src/                     # API Hono sobre Node
```

Dentro de las aplicaciones, los nombres exactos pueden seguir el esqueleto entregado, pero se conserva la agrupación por funcionalidad y la dirección de dependencias:

```text
frontend/src/
├── app/                         # Arranque y composición de la aplicación
├── components/ui/               # Componentes visuales reutilizables
└── features/
    ├── chat/
    │   ├── components/          # Mensajes, composer, estados y consumo
    │   ├── api/                 # Cliente HTTP del contrato
    │   ├── model/               # Estado y reglas propias del chat
    │   └── tests/
    └── location/                # Captura y estado local de ubicación/zona

api/src/
├── app/                         # Arranque, configuración y composición
├── shared/http/                 # Manejo transversal de errores HTTP, si se necesita
└── features/
    ├── chat/
    │   ├── presentation/http/   # Ruta, DTOs, validación y mapeo HTTP
    │   ├── application/         # Caso de uso y modelos propios
    │   │   └── ports/           # TextGenerationGateway que necesita el caso de uso
    │   ├── infrastructure/groq/ # Adaptador y normalización específica de Groq
    │   └── tests/
    └── health/
        ├── presentation/http/   # GET /api/health
        └── tests/
```

No crees todos los directorios si el comportamiento aún no los necesita. Manten juntas las partes de una funcionalidad y usá los puntos de extensión reales del esqueleto.

## Límites de responsabilidad

| Elemento | Puede conocer | No debe conocer |
| --- | --- | --- |
| UI de `chat` | Estado visual, acciones de la persona y tipos de respuesta del contrato | Clave de Groq, SDK, URL del proveedor o formato crudo de Groq |
| Cliente HTTP del frontend | Ruta `/api/chat`, DTOs del contrato, códigos de error y respuesta acordados | Mensaje de sistema, configuración del servidor o proveedor externo |
| Presentación HTTP de la API | Hono, DTOs HTTP, validación en ejecución, status y mapeo entre contrato y aplicación | Detalles visuales de React o credenciales expuestas al cliente |
| Caso de uso `chat` | Entrada validada, solicitud de respuesta y resultado de la funcionalidad | Hono, Groq SDK, variables de entorno o respuestas HTTP |
| Puerto `TextGenerationGateway` | Operación de generación y tipos propios que necesita el caso de uso | Protocolo del proveedor, framework HTTP o DTOs del navegador |
| Adaptador de Groq | SDK, configuración del proveedor y conversión entre tipos Groq y tipos propios | Componentes, estado de UI o cuerpos HTTP del cliente |
| `app` de API | Construcción de dependencias y registro de rutas | Reglas de negocio escondidas en el arranque |

La interfaz TypeScript del puerto pertenece al lado que la necesita (el caso de uso). El adaptador de Groq, en infraestructura, satisface ese contrato. Para una operación de generación de texto, `TextGenerationGateway` comunica mejor la responsabilidad que `Repository`: reservá un repositorio para guardar/consultar entidades o colecciones del dominio, como conversaciones persistidas si existieran. D1 no implementa persistencia ni requiere un `ConversationRepository`. No crees una abstracción para cada función: separá la llamada externa cuando ayude a probar el caso de uso sin red.

## DTOs y validación en las fronteras

Un DTO define los datos que cruzan un límite; puede ser un `type` o una `interface`, no necesita ser una clase por obligación. Conservá separados el contrato público, los modelos propios de la aplicación y los tipos del SDK:

| Límite | Forma de datos | Conversión |
| --- | --- | --- |
| Navegador ↔ API | `ChatRequestDto`, `ChatResponseDto`, `ApiErrorDto` según el contrato D1 (errores con sobre `{ error: { code, message, retryable } }`) | El cliente serializa la solicitud y valida/normaliza la respuesta recibida |
| HTTP → caso de uso | `GenerateReplyInput` y `GenerateReplyOutput` | La presentación valida y mapea el DTO a tipos de aplicación y vuelve a mapear el resultado al DTO |
| Aplicación ↔ proveedor | Tipos propios de `TextGenerationGateway` | El adaptador convierte al protocolo Groq y normaliza la respuesta del SDK |

El tipo estático no valida JSON en tiempo de ejecución. La frontera HTTP debe rechazar cuerpos inválidos y campos extra según el contrato antes de llamar al caso de uso. La ruta devuelve el DTO público explícitamente; no devuelve ni copia la respuesta cruda de Groq. No dupliques clases o mappers sin una transformación real que expresar.

## Dependencias permitidas

```text
UI → cliente HTTP → contrato de la API
ruta HTTP → caso de uso → puerto del proveedor ← adaptador Groq
arranque de API → conecta ruta, caso de uso y adaptador
```

- El caso de uso y las reglas de la funcionalidad no importan dependencias externas de infraestructura.
- Los adaptadores pueden depender de bibliotecas y tipos externos; traducen sus detalles a los tipos propios de la funcionalidad.
- El arranque compone las implementaciones concretas. No hace falta un contenedor de inyección de dependencias.
- No conectes el navegador directamente con Groq ni compartas `GROQ_API_KEY` con el frontend.

## Errores por frontera

Centralizá la traducción sin convertirla en una responsabilidad universal:

| Frontera | Responsabilidad |
| --- | --- |
| Adaptador Groq | Traducir errores del SDK/proveedor a fallos propios de aplicación; no construir respuestas HTTP ni mensajes de UI |
| API HTTP | Mapear fallos conocidos a status y `ApiErrorDto` del contrato; un manejador común cubre errores inesperados sin filtrar secretos |
| Cliente HTTP frontend | Normalizar error contractual, fallo de red y respuesta inválida en un resultado propio del cliente |
| Estado/presentación | Elegir copy por `code` y acciones por `retryable`; no mostrar el `message` técnico ni detalles del proveedor |

Un wrapper de `fetch` puede centralizar el cliente; no hace falta sumar Axios solo para tener interceptors. Los errores esperados pueden representarse con resultados tipados y los inesperados llegar al manejador global. Mantené el orden contractual de validación antes de comprobar configuración y no agregues reintentos automáticos en D1.

## Orígenes y CORS

En desarrollo, el navegador debe llamar rutas relativas como `/api/chat`; Vite reenvía `/api` a la API local. Así el navegador ve el mismo origen y no se necesita habilitar CORS para este recorrido. El proxy es una comodidad de desarrollo, no autenticación ni protección de la API.

En despliegue, preferí servir frontend y API bajo un mismo origen cuando la plataforma lo permita. Si se requieren orígenes separados, configurá CORS en la frontera HTTP de la API con una lista explícita de orígenes, métodos y cabeceras mínimos; no reflejes cualquier `Origin`, no habilites credenciales en D1 y atendé preflight sin ejecutar el caso de uso. CORS no autentica, no autoriza y no limita el consumo de Groq. Una API pública requiere controles de acceso y consumo fuera del alcance de CORS. Las respuestas de error para un origen permitido también deben incluir las cabeceras necesarias para que el cliente pueda leer el sobre contractual.

## Aplicación al alcance de D1

### Presentación de chat

La pantalla se compone como una vista de chat con estados, no como una página por estado. `ChatPage` coordina la composición; `TopBar`, `MessageList`/`MessageBubble`, `Composer`, `InlineNotice`, `LocationPrompt`, `UsagePanel`, `ConfirmDialog` y `MenuSheet` reciben datos y emiten acciones. Los nombres de composición y los límites están detallados en la [referencia D1](day-1/interface-reference.md). La interfaz visual no contiene llamadas a Groq ni lógica de servidor; el slice `chat` coordina el estado funcional.

### `chat`

Una solicitud contiene solo el mensaje actual. La ruta valida el contrato y no pasa historial ni ubicación. El caso de uso arma la llamada con el mensaje de sistema del servidor y el mensaje actual; el adaptador llama a Groq una sola vez y normaliza texto y usage. La ruta traduce éxito y errores al contrato HTTP.

La UI administra los intercambios visibles, la espera, errores, usage presentado y reinicio. No envía los mensajes anteriores en solicitudes de D1 ni guarda la conversación al recargar.

### `health`

`GET /api/health` confirma que la API está levantada. No necesita Groq ni debe leer o revelar credenciales.

### `location`

La ubicación o zona es estado del frontend durante D1. No se envía al endpoint de chat ni al prompt; no agregues una integración API para ella en este incremento.

## Pruebas por límite

- **Frontend `chat`:** prueba el DTO/cuerpo exacto del contrato, respuesta visible y estados de error/usage parcial; sustituí el cliente HTTP, no Groq directamente. El cliente normaliza errores contractuales, de red y respuestas inválidas sin decidir el copy visual.
- **API HTTP:** prueba validación en ejecución, campos extra, códigos HTTP y `ApiErrorDto` usando una dependencia sustituible; confirma que una solicitud inválida no llama al caso de uso y se valida antes de revisar configuración.
- **Caso de uso:** prueba que se solicita una única respuesta con el mensaje actual y que no depende del SDK o de la red.
- **Adaptador Groq:** prueba la conversión entre la respuesta del SDK y los tipos propios con datos simulados, incluidos errores traducidos a fallos propios.
- **Composición y arranque:** comprueba que health funciona sin configuración del proveedor y que la configuración faltante produce el error de contrato al usar chat. Verifica el proxy de desarrollo desde navegador; si un entorno usa orígenes separados, prueba origen permitido/no permitido, preflight y errores legibles desde el origen permitido.
- **Integración real:** se verifica aparte y solo cuando hay una clave configurada explícitamente como secreto de servidor. No sustituye las pruebas deterministas.

## Cuándo agregar una capa

Antes de agregar un módulo o una interfaz, identificá qué dependencia concreta separa y qué prueba o cambio futuro hace posible. Si no podés nombrar ese límite, mantené el código en la slice actual. No agregues D1 código de catálogo, persistencia, RAG, streaming, tools, dominio de lugares ni abstracciones para una base de datos que no existe.

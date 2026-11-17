# E1: integración básica del chat

Especificación de comportamiento para el incremento E1 de PartyQuest. Se entrega al estudiante junto con la [hoja de ruta del Día 1](day-1/roadmap.md), conservando las rutas relativas del paquete.

**Alcance:** navegador → API propia → Groq → respuesta visible. El Día 1 enseña una solicitud independiente por mensaje; no implementa memoria ni recomendaciones basadas en datos.

## 1. Resultado esperado

La persona escribe un mensaje, lo envía desde el navegador y ve la respuesta de Pachi. La aplicación usa `openai/gpt-oss-20b` desde la API propia. La conversación permanece visible mientras la página está abierta, pero los turnos anteriores no se envían al modelo ni se recuperan al recargar.

La ubicación es una demostración del permiso del navegador: se captura solo con permiso, o la persona puede escribir una zona. En D1 no se valida cobertura, no se consulta el catálogo, no se calcula distancia y no se envía la ubicación en el prompt.

## 2. Requisitos y aceptación

| ID | Requisito | Dado / cuando | Resultado observable |
| --- | --- | --- | --- |
| R1 | Enviar un mensaje desde la presentación a la API propia | La aplicación está configurada y la persona envía texto | La solicitud llega a la API; el navegador no llama directamente a Groq |
| R2 | Obtener una respuesta de Groq desde el servidor | La API recibe el mensaje y Groq responde | El texto vuelve al navegador y aparece en el chat |
| R3 | Mantener la clave de Groq solo en el servidor | Se inspeccionan los archivos del cliente y las solicitudes/respuestas | `GROQ_API_KEY` no aparece en el código cliente ni se devuelve al navegador |
| R4 | Conservar la conversación solo durante la página abierta | La persona envía más de un mensaje o recarga | Cada petición al modelo incluye solo el mensaje actual; los intercambios no persisten al recargar |
| R5 | Representar estados básicos | El chat está vacío, espera, recibe un fallo o la cuota está agotada | Se ve «¿Qué se arma hoy?», «Revisando opciones…» y un error recuperable; la cuota agotada se explica sin ofrecer «Reintentar» |
| R6 | Capturar ubicación o aceptar una zona escrita | La persona permite/deniega el acceso, el navegador falla o prefiere escribir | Con permiso, la ubicación se captura en el cliente; ante denegación/error se puede escribir una zona. No se afirma que está dentro/fuera de Valladolid |
| R7 | Mostrar consumo cuando el proveedor lo entrega | Groq responde con o sin usage | Si hay usage, se muestran tokens y costo teórico; si falta, se conserva la respuesta válida y el consumo se indica como no disponible/incompleto, nunca como cero inventado |
| R8 | Reiniciar la conversación | La persona pulsa «Nuevo plan» y confirma «¿Empezar otra conversación? Esta se borrará.» | Se limpian los intercambios, la ubicación/zona y el acumulado de consumo de la sesión; no se revoca el permiso del navegador ni se cambian las cuotas del proveedor |

## 3. Fuera del alcance de E1

- Memoria conversacional, persistencia al recargar e historial de conversaciones.
- Catálogo, filtrado de lugares, cálculo de distancias, geocercas, recomendaciones fundamentadas y RAG.
- Índice vectorial, Cohere, salida estructurada, herramientas, voz, despliegue y máquina de estados completa.
- Timeout de 60 segundos y reintento automático, que pertenecen a un incremento posterior.

El modelo puede responder con conocimiento general y producir datos no verificados. No se presenta la respuesta como una recomendación confirmada.

## 4. Contrato y pruebas

El [contrato de la API para el Día 1](api-contract.md) se entrega como parte del paquete estudiante. Al copiar esta especificación al starter como `docs/01-chat-integration.md`, actualiza ese enlace para apuntar a `api-contract.md`. Antes de implementar, el estudiante y su agente lo leen y resuelven dudas sin cambiar sus requisitos. Si encuentran una contradicción o una ambigüedad que impide implementar, se detienen y la consultan; no inventan un contrato alternativo.

El estudiante escribe pruebas deterministas para los casos de aceptación del contrato y las observa fallar antes de implementar el comportamiento. Las pruebas cubren envío, respuesta visible y separación cliente/servidor; simulan al proveedor cuando corresponda. Una prueba simulada no demuestra conectividad real con Groq.

Una llamada real requiere que la persona configure `GROQ_API_KEY` como secreto del servidor. No registrar ni compartir la clave. Si no se realiza esa comprobación, declararla pendiente.

## 5. Modelo y documentación pública

- Modelo: `openai/gpt-oss-20b`, seleccionado por `GROQ_MODEL` en la API.
- Credencial: `GROQ_API_KEY`, únicamente en el servidor.
- [Ficha pública del modelo](https://console.groq.com/docs/model/openai/gpt-oss-20b).
- [Límites de tasa de Groq](https://console.groq.com/docs/rate-limits); cada participante debe consultar los límites actuales de su propia organización.
- Las tarifas públicas y su fecha de consulta están en la hoja de ruta estudiante del Día 1.

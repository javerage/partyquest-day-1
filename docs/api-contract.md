# Contrato de la API — Día 1

Este documento define cómo se comunican la interfaz web y la API de PartyQuest durante el Día 1. Implementa este contrato con tu agente: el documento fija **qué** debe ocurrir, pero no entrega el código ni las pruebas resueltas.

La conversación del Día 1 no tiene memoria en el modelo: cada solicitud contiene solo el mensaje actual. La interfaz puede conservar los intercambios visibles mientras la página esté abierta, pero no los envía a la API como historial.

## 1. Convenciones

- La API ofrece las rutas bajo `/api`; no llevan prefijo de versión.
- Las solicitudes y respuestas usan JSON UTF-8 y nombres de propiedades en `camelCase`.
- El navegador llama a la API propia; solo la API llama a Groq.
- `GROQ_API_KEY` y `GROQ_MODEL` se configuran del lado servidor. La clave `GROQ_API_KEY` nunca aparece en el código del navegador ni en respuestas; la respuesta exitosa sí incluye el identificador público del modelo en `model`.
- La API debe arrancar aunque falte la configuración de Groq. El endpoint de chat informa el error cuando se lo solicita.
- Los ejemplos de texto de Pachi son ilustrativos: las respuestas reales del modelo pueden variar.

## 2. `GET /api/health`

Comprueba que la API está en ejecución. No llama a Groq ni revela si la configuración del modelo está presente.

```http
GET /api/health

HTTP/1.1 200 OK
Content-Type: application/json

{ "status": "ok" }
```

## 3. `POST /api/chat`

Envía un mensaje independiente al modelo `openai/gpt-oss-20b`, configurado en el servidor mediante `GROQ_MODEL`.

### Solicitud

```http
POST /api/chat
Content-Type: application/json

{ "message": "Hola, Pachi, ¿a dónde podemos ir el domingo?" }
```

El cuerpo debe ser un objeto JSON válido con **exactamente** una propiedad, `message`:

- `message` debe ser una cadena. Se recortan los espacios iniciales y finales.
- Después de recortarla, no puede estar vacía y puede tener hasta 2.000 puntos de código Unicode (inclusive). 2.000 es válido; 2.001 no.
- Cualquier propiedad adicional —por ejemplo `history`, `messages`, `system`, `model` o `location`— se rechaza. La interfaz no puede enviar turnos anteriores ni instrucciones para el modelo.
- Una solicitud inválida devuelve `400 invalid_request` y no llama a Groq.

### Respuesta exitosa

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "reply": "¡Va! ¿Qué tipo de plan tienen en mente?",
  "model": "openai/gpt-oss-20b",
  "usage": {
    "inputTokens": 157,
    "outputTokens": 680,
    "totalTokens": 837
  }
}
```

| Campo | Tipo | Significado |
| --- | --- | --- |
| `reply` | `string` | Respuesta no vacía de Pachi. |
| `model` | `string` | Identificador del modelo que usó la API. |
| `usage` | objeto o `null` | Consumo que informó el proveedor, normalizado como se indica abajo. |

La API llama al proveedor una sola vez por solicitud válida. Envía el mensaje de sistema definido por el servidor y el mensaje actual de la persona; no envía historial ni ubicación. Si el proveedor no devuelve texto utilizable, la API responde con un error `provider_error`.

## 4. Usage y costo

Cuando está disponible, `usage` tiene esta forma:

```ts
type Usage = {
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
};
```

Cada campo contiene un entero no negativo informado por el proveedor, o `null` si falta o no es válido. Si el proveedor no informa ningún campo, `usage` es `null`. No inventes ceros ni calcules un campo faltante a partir de los otros.

La falta total o parcial de `usage` **no invalida la respuesta**. La interfaz conserva `reply` y muestra el consumo como no disponible o incompleto. Si cuenta con los tres valores y la tarifa vigente del modelo, la interfaz calcula el costo teórico; la API no calcula costos ni conoce tarifas. El costo es una estimación, no una factura.

## 5. Errores

Toda respuesta no exitosa usa el mismo sobre JSON:

```json
{
  "error": {
    "code": "quota_exceeded",
    "message": "Provider quota or rate limit reached",
    "retryable": false
  }
}
```

El cliente usa `code` para elegir el estado y el texto visible. `message` es información técnica para depuración: **no se muestra a la persona**. Nunca incluyas secretos, trazas de pila ni respuestas crudas del proveedor.

| `code` | HTTP | `retryable` | Significado |
| --- | --- | --- | --- |
| `invalid_request` | 400 | `false` | El cuerpo no cumple las reglas de solicitud. |
| `configuration_error` | 503 | `false` | Falta `GROQ_API_KEY` o `GROQ_MODEL`, o la credencial/modelo configurado no es aceptado. |
| `quota_exceeded` | 429 | `false` | Groq alcanzó un límite de uso o tasa. No se promete cuándo estará disponible de nuevo. |
| `provider_error` | 502 | `true` | Falló la comunicación con Groq, hubo un error del proveedor o no se recibió texto utilizable. |
| `internal_error` | 500 | `true` | Ocurrió un error inesperado en la API. |

La API no reintenta automáticamente en D1. Todo 429 de Groq se representa como `quota_exceeded`; no hace falta distinguir entre límite por minuto y cuota diaria.

## 6. Responsabilidades de la interfaz

| Respuesta o situación | Comportamiento esperado |
| --- | --- |
| Antes de enviar | No enviar texto vacío o de más de 2.000 puntos de código Unicode. Enviar solo `{ "message": "…" }`. |
| Solicitud en curso | Mostrar «Revisando opciones…». No iniciar un reintento automático ni aplicar el timeout de incrementos posteriores. |
| 200 | Mostrar `reply`. Si `usage` es completo, mostrar tokens y costo teórico cuando haya tarifa disponible. |
| Usage parcial o `null` | Mantener la respuesta y marcar el consumo como incompleto o no disponible; no presentar cero inventado. |
| `quota_exceeded` | Explicar que se alcanzó el límite de uso. No ofrecer «Reintentar» ni prometer cuándo vuelve. |
| Otro error con `retryable: true` | Mostrar un error recuperable y ofrecer «Reintentar» y «Editar mensaje». |
| Error con `retryable: false` | Mostrar un error recuperable y ofrecer «Editar mensaje», sin reintentar. |
| Error de red o respuesta que no cumple el contrato | Tratar como fallo recuperable; no mostrar detalles técnicos ni secretos. |

En D1 el error explica que la conversación sigue visible en esta página; todavía no persiste al recargar.

## 7. Qué queda fuera del contrato del Día 1

No implementes en D1: historial enviado al modelo, memoria o persistencia de conversación, ubicación en la solicitud, catálogo y filtrado, cálculo de distancias, geocerca, RAG, citas, streaming, herramientas, autenticación, límites propios de peticiones, ni reintento o timeout automáticos. Esos comportamientos requieren una especificación de un incremento posterior.

La ubicación capturada por el navegador o escrita por la persona permanece en la interfaz durante D1 y no se envía a la API ni al prompt.

## 8. Comprobaciones de aceptación

Escribí pruebas deterministas contra la interfaz HTTP pública y simulá Groq; no necesitás una clave real para estas pruebas. Como mínimo, comprobá que:

1. `GET /api/health` devuelve 200 incluso sin clave y no llama a Groq.
2. Una solicitud válida devuelve `reply`, `model` y usage normalizado; Groq recibe una sola llamada con el mensaje de sistema y solo el mensaje actual ya recortado.
3. Campos extra como `history` o `messages`, JSON inválido, mensaje no textual, vacío y mensaje sobre el límite devuelven `400 invalid_request` sin llamar a Groq. El límite de 2.000 puntos de código Unicode es válido; 2.001 no.
4. La validación de una solicitud inválida ocurre antes de comprobar la configuración.
5. Si falta `GROQ_API_KEY` o `GROQ_MODEL`, se devuelve `503 configuration_error` sin llamar a Groq.
6. Un 429 del proveedor se convierte en `429 quota_exceeded`; un fallo del proveedor o de red se convierte en `502 provider_error`.
7. Usage ausente o parcial no elimina la respuesta válida y no se convierte en cero.
8. Una clave de prueba nunca aparece en cuerpos de respuesta ni en mensajes de error.

Las pruebas simuladas comprueban el contrato, no la conectividad real con Groq. Una llamada real requiere configurar `GROQ_API_KEY` como secreto del servidor; no registres ni compartas la clave.

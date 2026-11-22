# Contrato del índice — Día 2, B3

Este contrato define la construcción y consulta local de un índice de fragmentos del corpus. Especifica el comportamiento que implementarás; no incluye una solución ni un índice generado. B3 añade dos comandos CLI y no modifica el chat ni crea endpoints.

## Alcance y entradas

- Usa el catálogo v6 y el corpus Markdown de esta copia; ambos deben ser consistentes. Valida entradas con las reglas del validador de aportes existente, reutilizando su lógica o una extracción compartida comprobada. Los avisos no bloquean; los errores sí.
- Se permiten aportes personales con evidencia y validación. El estudiante debe autorizar explícitamente que el agente cambie sus archivos. No indexar borradores, fichas de trabajo, respaldos ni notas docentes.
- El catálogo gobierna filtros y datos estructurados; el corpus aporta descripciones. Recuperar un lugar no acredita elegibilidad, horario actual, disponibilidad ni veracidad.
- No se buscan fuentes, completan hechos ni aprueban lugares automáticamente al indexar. Se conservan desconocidos válidos y se rechazan catálogo vacío, descripciones ausentes, nombres o IDs duplicados, lugares sin fragmento y fragmentos sin lugar. La cantidad de fragmentos refleja los datos validados, incluidos aportes; no se fija en 54.
- La integración del índice al inicio de la API y a `POST /api/chat` corresponde a B4; B3 no altera esos componentes.

## Fragmentación y procedencia

- Cada encabezado `### <nombre>` fuera de un bloque de código cercado inicia exactamente un fragmento y debe coincidir con el `name` de un único lugar del catálogo. Usa el `id` como `placeId` estable.
- El fragmento termina antes del siguiente encabezado de nivel 1, 2 o 3, una línea separadora `---` o el fin de archivo. Dentro de fences, estos marcadores no delimitan.
- No indexes introducción, reglas generales, títulos de zona ni bibliografía; no proceses otros archivos o carpetas automáticamente.
- `text` conserva el encabezado y cuerpo completos, incluida la línea `Horario:`, referencias, advertencias y contradicciones. Normaliza CRLF a LF y elimina solo líneas vacías de los extremos. No resumas, traduzcas, corrijas hechos ni quites fuentes.
- Debe haber descripción además de `Horario:`; un fragmento vacío o compuesto solo por el horario es inválido. No subdividas un lugar: si el proveedor rechaza su longitud, informa el error; no trunques.
- Guarda procedencia: nombre del archivo, encabezado y líneas inclusivas de inicio/fin, numeradas desde 1. No guardes rutas absolutas. El nombre de archivo, hash y rango identifican evidencia documental, pero no afirman que una fuente externa respalde cada frase. No deduzcas URLs ni fechas.

## Índice JSON v1

El archivo es JSON UTF-8. Solo se aceptan las claves indicadas; todas son obligatorias, no hay migración automática.

Campos raíz: `schemaVersion: 1`, `provider: "cohere"`, `model: "embed-v5.0-pro"`, `dimensions: 1024`, `documentInputType: "search_document"`, `queryInputType: "search_query"`, `corpusSha256` y `catalogSha256` (SHA-256 de los bytes completos, hexadecimal minúsculo de 64 caracteres), y `chunks` (arreglo no vacío ordenado por `placeId` ascendente mediante comparación de cadenas, no por configuración regional).

Cada fragmento contiene exactamente `placeId`, `name`, `text`, `source` y `embedding`. El ID es único; `name` coincide exactamente con catálogo y encabezado; `text` es el texto extraído. `source` contiene exactamente `document`, `heading`, `startLine` y `endLine`; `document` es el nombre base del corpus y `heading` no incluye `###`. Los números de línea son enteros positivos y el final no precede al inicio. `embedding` contiene exactamente 1024 números finitos y su norma no es cero.

Al consultar, valida esquema y coincidencia con los fragmentos actuales: cantidad, IDs, nombres, textos y procedencias. No basta con hashes de aspecto válido. Las rutas se toman de argumentos, nunca del índice. Los hashes detectan también cambios de formato: cualquier cambio de bytes exige reconstruir. El índice no contiene claves, consultas, historial ni fichas privadas; no demuestra que un vector sea genuino ni es una firma de autenticidad.

## Comandos de terminal

Define y ejecuta los scripts desde el directorio de la API:

**macOS/Linux/WSL — shell POSIX (Bash/Zsh):**
```sh
npm run index:build -- --catalog ./data/places.json --corpus ./data/corpus/lugares-valladolid.md --output ./data/places-index.json
npm run index:query -- --catalog ./data/places.json --corpus ./data/corpus/lugares-valladolid.md --index ./data/places-index.json --text "¿Dónde puedo probar tamales cocinados a leña?"
```

`index:build` requiere `--catalog`, `--corpus`, `--output`; `index:query` requiere `--catalog`, `--corpus`, `--index`, `--text`. Las rutas son explícitas, relativas al directorio de trabajo; se admiten espacios si el argumento se pasa completo. No hay rutas implícitas. `--help` como único argumento en cualquiera muestra uso, opciones, configuración y códigos de salida, termina con 0 y no lee entradas ni llama al proveedor. La ayuda advierte que cada ejecución puede consumir cuota.

Opciones desconocidas/repetidas/sin valor, argumentos posicionales o `--help` combinado con otras opciones son `invalid_arguments`; no se ignoran. `--text` se recorta y debe medir de 1 a 2.000 unidades UTF-16. No es historial ni preferencias del catálogo. La salida no puede ser el catálogo, corpus ni alias del mismo archivo; no se acepta destino simbólico. El directorio de salida debe existir y no se crean directorios arbitrarios.

`COHERE_API_KEY` solo se lee del entorno del proceso backend; nunca es argumento, no se solicita en navegador ni se imprime. Modelo y dimensión son fijos. No hay reintentos automáticos ni reconstrucción implícita durante consulta. Ningún índice generado se incluye en este paquete.

## Construcción

Valida primero argumentos, archivos, JSON, catálogo y corpus. Los errores locales preceden configuración y no consumen cuota. Lee una instantánea coherente, extrae todo, y envía los textos por `placeId` ascendente en lotes secuenciales de hasta 32. Para cada solicitud usa `model: "embed-v5.0-pro"`, `input_type: "search_document"`, `output_dimension: 1024`, `embedding_types: ["float"]` y `truncate: "NONE"`.

Cada respuesta debe tener exactamente un vector por entrada, en el mismo orden; rechaza vector ausente/adicional, dimensión incorrecta, valor no finito o norma cero. Cada llamada espera como máximo 60 segundos y no se reintenta. Fallos de red, tiempo, cuota o respuesta invalidan la construcción completa; llamadas ya realizadas pueden haber consumido cuota.

Forma y valida el índice completo, escribe a un temporal en el mismo directorio y verifica que las entradas no cambiaron desde su lectura. Solo entonces reemplaza la salida mediante renombrado atómico. Todo fallo previo conserva el archivo anterior byte por byte; si no existía, no deja índice parcial. Limpia únicamente el temporal creado por esta ejecución en errores controlados. No se admiten construcciones concurrentes al mismo destino. Una interrupción puede dejar un temporal: no es un índice y nunca reemplaza automáticamente el anterior.

## Consulta

Valida argumentos, catálogo y corpus, y después índice y vigencia. Índice ausente, inválido, incompatible o desactualizado se rechaza sin llamar a Cohere. Vectoriza solo `--text` con `search_query`, dimensión 1024, vectores `float` y `truncate: "NONE"`; aplica espera, ausencia de reintentos y validación vectorial idénticas.

Calcula coseno (producto punto dividido por producto de normas; no presupongas normalización), ordena similitud descendente y desempata por `placeId` ascendente. Devuelve hasta `min(3, cantidad)`, con puntuación, texto y procedencia. Es solo lectura: no invoca Groq, modifica archivos, preferencias ni filtrado. La similitud no es probabilidad ni garantía; no hay umbral de «sin información».

## Salidas y errores

En éxito el programa emite un único objeto JSON en una línea de `stdout`, seguido de salto de línea. Build: `status: "built"`, `chunks`, `model`, `dimensions`, `bytes` y `durationMs` entero no negativo. Query: `status: "queried"`, `model`, `dimensions` y `results`; cada resultado solo contiene `placeId`, `name`, `score`, `text`, `source`. `score` finito entre −1 y 1; limita únicamente desviaciones numéricas de redondeo. No incluyas vectores completos ni repitas consulta. Métricas no inventan tokens ni estimaciones presentadas como factura. La ayuda es texto en stdout. En error stdout queda vacío; stderr contiene exactamente `ERROR <code>: <mensaje>` y salto de línea, sin cuerpo del proveedor, claves, consultas, stack ni contenidos de archivos.

| Código de salida | Código | Mensaje exacto |
| --- | --- | --- |
| 2 | `invalid_arguments` | `Argumentos inválidos. Consulta --help.` |
| 2 | `input_error` | `No se pudo leer una entrada o interpretar su JSON.` |
| 1 | `invalid_data` | `Catálogo o corpus inválidos. Revisa el validador de aportes.` |
| 1 | `configuration_error` | `Configura una clave Cohere válida en el entorno del backend.` |
| 1 | `index_missing` | `No existe el índice. Ejecuta index:build.` |
| 1 | `invalid_index` | `El índice es inválido. Reconstrúyelo con index:build.` |
| 1 | `incompatible_index` | `Versión, proveedor, modelo o dimensión incompatibles. Reconstruye el índice.` |
| 1 | `stale_index` | `Las entradas cambiaron. Reconstruye el índice.` |
| 1 | `quota_exceeded` | `Cohere rechazó la solicitud por cuota. Revisa tu cuenta antes de reintentar.` |
| 1 | `provider_timeout` | `Cohere no respondió a tiempo. No se reintentó la solicitud.` |
| 1 | `provider_error` | `No se obtuvieron vectores válidos. No se reintentó la solicitud.` |
| 1 | `inputs_changed` | `Las entradas cambiaron durante la construcción. Ejecuta el comando de nuevo.` |
| 1 | `write_error` | `No se pudo guardar el índice completo. El índice anterior no fue reemplazado.` |

Precedencia: argumentos → lectura/JSON de entradas → validación de datos → índice (en consulta) → configuración → proveedor → escritura (en build). Índice inexistente es `index_missing`; otros errores al leer/parsear índice, `invalid_index`. Metadatos de compatibilidad distintos dan `incompatible_index`; estructura incompleta, `invalid_index`; hashes válidos pero distintos, `stale_index`. Datos inválidos prevalecen sobre clave ausente. HTTP 401/403 da `configuration_error`, 429 da `quota_exceeded`; otros errores HTTP, de red o forma dan `provider_error`.

Avisos no bloqueantes del validador se escriben en stderr antes del resultado, prefijo `AVISO`, sin contenido de archivos ni secretos. No emitas avisos de éxito antes de completar build. Las pruebas fijan avisos esperados o su ausencia.

## Privacidad y límites

La clave se maneja solo en backend. Cohere recibe textos públicos de fragmentos al construir y la consulta al buscar; no recibe catálogo completo, rutas, fichas de evidencia, conversaciones ni ubicación personal. No guardes logs persistentes de consultas ni cuerpos de solicitud/respuesta. Coordenadas ya publicadas en el corpus son contenido documental, no ubicación del estudiante.

Las pruebas de aceptación son deterministas, mediante interfaz pública y proveedor reemplazable; no requieren clave real ni llaman a Cohere. Deben comprobar códigos, stdout/stderr, solicitudes fake y efectos en archivos. Rechazos locales implican cero llamadas; fallos conservan el índice anterior y las entradas; consultas no modifican entradas ni índice. Casos: formato/orden/hashes/métricas; fragmentación y fences/CRLF/separadores; entradas vacías/inválidas/duplicadas y desconocidos; ayuda, argumentos, rutas y límites de texto; clave/401/403/429/timeout/red/respuesta inválida sin reintentos ni filtración; vectores inválidos y lotes de 32/33; escritura/entradas cambiadas/fallos atómicos; índice ausente/corrupto/incompatible/obsoleto; coseno, desempate, máximo y mínimo de resultados; y aporte que vuelve obsoleto el índice y luego puede recuperarse con fake controlado.

## Evaluación real separada

Las llamadas reales requieren autorización explícita separada para proveedor, cuenta y llamadas. Una clave gratuita de prueba puede tener límites que cambian; consulta la documentación oficial de Cohere antes de planear. No compartas claves ni crees cuentas para evadir cuotas. La evaluación real, si se autoriza, fija antes de buscar una pregunta de recomendación y conjunto relevante de al menos tres IDs; luego fija pregunta distintiva del aporte y su ID objetivo. No cambies preguntas/conjunto tras ver resultados. Registra modelo, dimensión, cantidad, tamaño, duración, errores y consumo informado. Un resultado top-3 solo evidencia ese caso, no relevancia general. El fallo semántico se registra aparte de las pruebas deterministas.

## Se usa a partir de bloques posteriores

- **Se usa a partir de B4:** cargar el índice al iniciar la API, integrarlo con `POST /api/chat`, fundamentar respuestas/citas y responder ante evidencia ausente.
- **Se usa a partir de B5:** streaming y pruebas relacionadas.
- **Se usa a partir de B6:** distribución del índice en el entorno publicado.
- Integración de preferencias activas permanece separada del índice. No se implementan en B3 respuestas de chat, proveedor local/alterno, servicio de trabajos, bloqueo distribuido ni reconstrucción incremental.

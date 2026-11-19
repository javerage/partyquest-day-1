# Ficha para aportar un lugar

Completa una ficha por cada lugar con el estudiante. Propongan entre 3 y 5 lugares y consulten primero el catálogo para evitar duplicados. Usa solo evidencia de la ficha de Google Maps o una página oficial; anota su fuente y fecha de observación. Si algo no está respaldado, conserva `null`, `unknown` o `unconfirmed`: no completes por memoria ni aproximación.

## Campos del catálogo v6

| Campo | Qué registrar | Reflejo en el fragmento |
| --- | --- | --- |
| `id` | Identificador único kebab-case, por ejemplo `cafe-ejemplo`. | No se repite en el encabezado. |
| `name` | Nombre exacto de la ficha de Maps, sin espacios sobrantes. | Encabezado exacto `### <nombre del catálogo>`. |
| `category` | Tipo descriptivo kebab-case. Un valor nuevo genera aviso, no error. | No se exige repetirlo. |
| `zone` | `historic-center`, `calzada-sisal`, `northern-neighborhoods`, `surroundings` o `valladolid-unspecified`. | No inventes distancias ni vecindarios. |
| `locationScope` | `city` o `surroundings`; usa `surroundings` con la zona homónima. | Solo con evidencia. |
| `coordinates` | `null` mientras no se confirmen. En Google Maps abre la ficha, selecciona la ubicación en el mapa y copia las coordenadas que muestra; anota fuente y fecha. El validador informa el geohash de precisión 7 esperado. Nunca uses el centro de la zona como aproximación. | No es necesario incluirlas. |
| `openingHours` | `confirmed` requiere fuente, fecha y los siete días de lunes a domingo; cada día lleva `intervals`. Usa `[]` para cerrado, horas `HH:MM` e intervalos semiabiertos `[opens, closes)`. `00:00`–`00:00` representa 24 horas; no uses `24:00`. Si no tienes evidencia, usa `unconfirmed` y deja `source`, `observedOn` y `weekly` en `null`. `no-schedule` (espacio público sin horario de apertura) también conserva esos tres campos en `null`, igual que `unconfirmed`. | Una sola línea `Horario:`: `sin confirmar`, `sin horario de apertura registrado`, o un horario confirmado, por ejemplo: `Horario: lunes a viernes, 09:00–17:00 (fuente: Google Maps, revisado 2026-11-06).` |
| `accessCost` | Solo costo de entrada: `paid` con monto positivo o `null`, `free` con 0, `unknown`/`not-applicable` con `null`. Un restaurante nunca es `free`: el consumo no es una tarifa de acceso. | No confundas acceso con gasto. |
| `foodService` | `available` admite `foodTypes` nulo o lista no vacía kebab-case. El gasto es nulo o `{min,max,currency:"MXN",basis,source,observedOn}`; montos finitos, `min ≥ 0` y `max ≥ min`. Si la fuente publica un promedio único, `min` y `max` coinciden. Con `unknown` o `not-applicable`, ambos campos son `null`. | Describe solo lo respaldado por evidencia. |
| `contact` | `email`, `phone`, `website` y `address`: texto no vacío o `null`; el sitio empieza con `http://` o `https://`. Copia `address` literalmente de Maps. | No agregues datos sin confirmar. |

## Comprobación de duplicados

Antes de crear el borrador, busca en `places` un `id` o nombre igual. Compara también el nombre ignorando mayúsculas, acentos, puntuación y espacios repetidos; revisa la ubicación. En modo borrador, el validador rechaza ID y nombre duplicados y avisa si las coordenadas quedan a menos de 50 m de un lugar existente. Un aviso requiere revisar la evidencia, no renombrar un duplicado para ocultarlo.

## Bloque para copiar y completar

Guarda una copia por lugar en `catalog-drafts/<id>/sheet.md`. Para cada valor, registra evidencia: enlace o descripción concreta de la fuente, y fecha; si el dato no se confirma, escribe `null` y explica qué falta.

```markdown
# Ficha: <nombre exacto>

- id: <valor>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD>
- name: <valor>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD>
- category: <valor>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD>
- zone: <valor>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD>
- locationScope: <city|surroundings>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD>
- coordinates: <null|latitude, longitude, geohash>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD|no confirmada>
- openingHours: <status, source, observedOn, weekly>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD|no confirmada>
- accessCost: <status, amountMXN>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD|no confirmada>
- foodService: <status, foodTypes, estimatedSpendPerPersonMXN>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD|no confirmada>
- contact.email: <valor|null>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD|no confirmada>
- contact.phone: <valor|null>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD|no confirmada>
- contact.website: <valor|null>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD|no confirmada>
- contact.address: <texto copiado de Maps|null>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD|no confirmada>

## Fragmento del corpus
- Descripción de ambiente y uso respaldada por evidencia: <...>
- Horario: <una sola línea coherente con openingHours>
  Evidencia (enlace o descripción): <...>
  Fecha de observación: <YYYY-MM-DD|no confirmada>
```

El catálogo es la fuente estructurada del horario; la línea del fragmento lo refleja. El validador comprueba estructura y consistencia, no la veracidad de la fuente ni del dato.

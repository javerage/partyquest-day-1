# PartyQuest: roadmap para construir el Día 1

Guía pública para cada participante y su agente de IA. Define el objetivo, la secuencia, qué hacer y qué evidencia permite marcar un incremento como completado. Trabajá sobre una copia propia de esta hoja: el estado empieza pendiente y se actualiza solo con evidencia observada.

**Alcance:** crear el proyecto base en clase, incorporar las plantillas de presentación y los documentos entregados, e implementar PartyQuest D1 mediante incrementos pequeños y autorizados. La [guía de creación desde carpeta vacía](setup-from-scratch.md) explica el arranque. Al cierre, el facilitador puede observar una llamada manual real con Groq; su guía y la solución de referencia son material docente, no se incluyen en el paquete estudiante.

## 1. Resultado del día

Al terminar, la aplicación debe permitir:

1. escribir a Pachi desde la interfaz entregada y ver una respuesta;
2. enviar el mensaje actual desde el navegador a la API propia, que llama a Groq con `openai/gpt-oss-20b`;
3. mantener `GROQ_API_KEY` solo en el servidor;
4. mostrar los intercambios mientras la página permanezca abierta, sin enviar turnos anteriores al modelo ni persistirlos al recargar;
5. presentar los estados vacío, espera, error recuperable y cuota agotada;
6. capturar ubicación solo con permiso del navegador o permitir escribir una zona; D1 no clasifica cobertura, consulta catálogo ni calcula distancias;
7. confirmar «Nuevo plan» y limpiar intercambios, ubicación/zona y consumo de la sesión, sin revocar el permiso ni cambiar cuota;
8. mostrar tokens y costo teórico cuando hay usage. Si falta, conservar la respuesta e indicar datos incompletos/no disponibles, nunca inventar cero;
9. escribir pruebas deterministas del contrato y explicar qué comprueban.

**Límite:** D1 no consulta catálogo ni corpus. Las respuestas pueden incluir datos no verificados; no las presentes como recomendaciones fundamentadas. La ubicación tampoco se envía al prompt de Groq.

## 2. Punto de partida y separación de responsabilidades

| Lo que creás o recibís | Lo que implementás durante D1 |
|---|---|
| Desde una carpeta vacía, proyecto npm workspace con frontend y API, comandos y configuración inicial | Pruebas deterministas del contrato entregado y comportamiento de cada bloque |
| Documentos D1 (roadmap, contrato, arquitectura, E1 e instrucciones de agente) | API propia, llamada del servidor a Groq y conexión del chat |
| Archivos de presentación: tokens, shell, Pachi, componentes visuales y menú Apariencia ya funcional | Estados de conversación, errores, usage/costo, ubicación/zona y «Nuevo plan» |
| Puntos `TODO(D1·B#.#)` sin algoritmo resuelto | Solo comportamiento del incremento autorizado, en orden |
| Catálogo/corpus de referencia sin uso en D1 | Nada de RAG, filtrado ni distancias durante D1 |

**No rediseñes la interfaz.** Las plantillas visuales se copian como materiales de presentación; los `TODO` señalan dónde se trabajará, no implementan la solución ni autorizan al agente a seguir al próximo bloque.

## 3. Estado personal de incrementos

El estado pertenece a tu copia de este roadmap. Antes de trabajar, copiá el bloque al final en una sección «Mi seguimiento» si preferís preservar la fuente original. Estados permitidos: **pendiente**, **en curso**, **bloqueado** (anotá qué decisión/dato externo falta), **completado** (solo tras cumplir evidencia). No marques completo por quitar un TODO o por el reporte del agente.

El avance se registra **por incremento**, no por sesión ni por mensaje al agente. En cada cierre anotá comando/acción, resultado y fallos. Una evidencia ausente deja el incremento pendiente.

| ID | Resultado observable | Previo | Checks para cerrar | Estado / evidencia personal |
|---|---|---|---|---|
| D1·B1.1 | Crear `partyquest/` y workspaces `frontend/` y `api/`; instalar dependencias fijadas | Node/npm disponibles | `npm ls --depth=0`; manifiestos de ambos workspaces y lockfile raíz presentes | Pendiente — |
| D1·B1.2 | Incorporar configuración mínima y archivos de proyecto | B1.1 | TypeScript reconoce frontend/API; `.gitignore` excluye `.env`; `.env.example` solo tiene valores falsos | Pendiente — |
| D1·B1.3 | Incorporar shell visual y documentos estudiante; presentar la pantalla sin comportamiento de chat | B1.2 | Revisar archivos copiados y enlaces; `npm run dev`; pantalla carga; sin llamada a Groq | Pendiente — |
| D1·B1.4 | Añadir `GET /api/health` y proxy same-origin | B1.3 | Health HTTP 200 `{ "status": "ok" }` sin clave; browser usa `/api`; sin CORS permisivo | Pendiente — |
| D1·B2.1 | Fijar con una prueba el contrato mínimo del mensaje actual | B1.4 | Prueba por interfaz pública; status/cuerpo exactos; observar RED antes de comportamiento | Pendiente — |
| D1·B2.2 | Implementar validación y respuesta del servidor mediante un gateway sustituible | B2.1 | JSON inválido/campos extra rechazados antes del proveedor; tests con fake; no secretos en errores | Pendiente — |
| D1·B2.3 | Conectar el adaptador Groq en la API, solo con variables de entorno del servidor | B2.2 | Clave ausente produce error de configuración; fake determinista sigue siendo la prueba normal; no clave en bundle/request | Pendiente — |
| D1·B2.4 | Conectar envío desde UI y representar respuesta | B2.3 | Cuerpo del browser contiene solo `{ "message": "…" }`; respuesta aparece; no se envía historial | Pendiente — |
| D1·B3.1 | Mostrar estados de error recuperable y cuota agotada | B2.4 | Proveedor/HTTP falso; copy seguro, retry solo manual cuando procede | Pendiente — |
| D1·B3.2 | Mostrar y acumular usage/costo cuando sean completos | B2.4 | Usage parcial o ausente no pierde respuesta ni se vuelve cero; cálculo contra tarifa fechada | Pendiente — |
| D1·B4.1 | Comparar instrucciones de sistema manteniendo igual el mensaje de usuario | B2.4 | Registrar prompt y observación sin afirmar que el modelo comprueba hechos; ninguna llamada sin permiso/clave | Pendiente — |
| D1·B5.1 | Completar pruebas deterministas del contrato y revisar RED → GREEN | B2.1–B3.2 | Probar límites y errores nombrados por el contrato; documentar qué la prueba no demuestra | Pendiente — |
| D1·B6.1 | Capturar ubicación con permiso o permitir zona escrita sin enviarla a Groq | B2.4 | Permiso concedido/denegado/no disponible; inspeccionar que request/prompt no incluye ubicación | Pendiente — |
| D1·B6.2 | Confirmar «Nuevo plan» y reiniciar solo estado de la conversación | B3.2, B6.1 | Cancelar conserva; confirmar limpia intercambios/ubicación/usage, no cuota ni tema; sin persistencia al recargar | Pendiente — |
| D1·B6.3 | Ejecutar cierre local completo con mocks; llamada real opcional y separada | B1–B6 | Tests, typecheck/build, recorrido manual; si Groq se prueba, registrar evidencia sin credenciales | Pendiente — |

## 4. Cómo trabajar con el agente

**Un prompt, un incremento, una autorización.** En cada fila del roadmap seguí este ciclo:

1. Pedí al agente que lea `AGENTS.md`, el incremento elegido, el contrato y la guía pública vinculada.
2. El agente explica objetivo, comportamiento observable, rutas previstas y checks. No modifica archivos todavía.
3. Autorizá ese incremento explícitamente. Si falta una decisión, el agente se detiene y pregunta.
4. El agente hace solo ese incremento. Los TODO de otros IDs no son autorización.
5. Corré o presenciá los checks; compará la evidencia con la fila del roadmap.
6. Anotá estado/evidencia. Solo entonces autorizá el siguiente incremento.

### Prompt para solicitar el alcance antes de autorizar

```text
Vamos a trabajar únicamente en [ID del incremento] del roadmap.
Leé AGENTS.md, la fila completa de ese incremento y sus documentos previos.
Todavía no cambies archivos. Explicame el objetivo observable, el concepto,
las rutas que pensás tocar y cómo vas a comprobarlo. Señalá cualquier decisión
que falte. Esperá mi autorización explícita para implementar.
```

### Prompt después de autorizar

```text
Autorizo únicamente [ID del incremento]. Implementá ese alcance y nada más.
Si corresponde, primero agregá la prueba determinista y observá que falle antes
de implementar. Ejecutá solo los checks definidos para este incremento; reportá
archivos, comandos, resultados y cualquier check pendiente. No marques otro
incremento como completo y detenete antes del siguiente.
```

No pegues una lista de prompts como una orden para ejecutar en cadena. Usá el siguiente prompt únicamente después de revisar la evidencia y autorizar el nuevo alcance.

## 5. Modelo, consumo y cuotas

- Modelo del ejercicio: `openai/gpt-oss-20b`; API selecciona con `GROQ_MODEL`, secreto `GROQ_API_KEY`.
- Tarifa consultada el **2026-10-27**, USD por millón de tokens: entrada **$0.075**, entrada cacheada **$0.037**, salida **$0.30**. Estimación no es factura; los precios pueden cambiar.
- Revisá [ficha pública del modelo](https://console.groq.com/docs/model/openai/gpt-oss-20b) y [límites Groq](https://console.groq.com/docs/rate-limits); cada persona revisa su propia organización.
- Uso o tarifa ausente no bloquea respuesta válida ni se inventa como cero.

## 6. Referencias del paquete estudiante

- [Contrato API D1](../api-contract.md)
- [Arquitectura D1](../architecture.md)
- [Matriz de interfaz D1](interface-reference.md) y [referencia HTML](interface-reference.html)
- [Construcción desde carpeta vacía](setup-from-scratch.md)
- [Mapa de archivos del bundle y TODOs](template-file-map.md)
- [E1](../01-chat-integration.md)
- `AGENTS.md` (archivo raíz que entrega el facilitador con el bundle)
- [Modelo Groq](https://console.groq.com/docs/model/openai/gpt-oss-20b)
- [Límites Groq](https://console.groq.com/docs/rate-limits)

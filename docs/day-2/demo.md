# Día 2 · Demostración final de PartyQuest

**Guion preparado; no acredita demo ejecutada.** Presenta la misma aplicación local que construiste desde D1. No hay app nueva ni despliegue; la publicación corresponde a D3. No uses datos personales ni claves. Una demo real con proveedores requiere autorización explícita y límite de consumo; un proveedor simulado se identifica como tal. Cuota o acceso fallidos significan «No evaluado», no «Pasa».

## Antes de presentar

Al cierre del ejercicio completo, ejecuta las pruebas preparadas y registra comando, resultado, conteo y fallos. No sustituyas resultados de pruebas por la demo. Anota revisión de catálogo/corpus/índice y verifica su correspondencia sin reconstruir durante la demo. Fija antes de consultar solicitud, preferencias, conjunto admisible, seguimiento referido a un lugar mostrado, pregunta con evidencia y dato ausente; confirma sus respaldos en tus propios datos. Acuerda autorización, proveedor y presupuesto antes de llamadas. No compartas `.env`, cabeceras o identificadores personales. El README de este paquete enumera los comandos locales D1; no los confundas con los checks de plataforma D3.

## Recorrido

1. **Preferencias:** envía el caso fijado. Pasa si aplica las preferencias claras, usa lugares admisibles y no inventa costo, disponibilidad ni cercanía.
2. **Contexto:** pregunta por el segundo lugar que realmente se mostró. Pasa si resuelve con lista vigente y conserva preferencias; si no es resoluble/ambiguo, aclara.
3. **Fuentes:** formula la pregunta fijada. Pasa si las citas literales y fuentes respaldan lo dicho; la selección semántica se revisa por separado del HTTP.
4. **Dato ausente:** pregunta lo fijado y previamente comprobado como ausente. Pasa si reconoce límite y no inventa ni convierte falta documental en certeza.
5. **Streaming/detener:** observa etapas solo cuando se ejecuta realmente interpretación (`interpreting`), búsqueda (`searching_places`) o lectura de descripciones (`reading_descriptions`). `content` aparece después de validar la respuesta; su concatenación coincide con `reply`. Activa «Detener» durante otro envío. Pasa si no se persiste respuesta incompleta y queda recuperación manual.
6. **Recarga:** verifica conversación activa y mensaje interrumpido; no hay duplicado ni respuesta parcial presentada como completa; ofrece «Reintentar» o «Editar mensaje». Editar no envía automáticamente.
7. **Preparación D3:** explica ruta `/api/chat`, separación frontend/API, secretos server-side y datos preconstruidos. Checks pendientes de D3: health 200 con `{"status":"ok"}`, API desconocida 404 JSON, raíz/ruta desconocida de frontend entrega app, chat funciona en mismo origen, datos cargados sin reconstrucción y secretos ausentes en navegador/logs; local continúa funcionando. No afirmes publicación por tener código/build local.

Si un caso previsto no se puede ejecutar, regístralo no evaluado; conserva el primer resultado y no cambies criterios después de ver respuesta. Una salida HTTP exitosa no demuestra corrección semántica. No repitas llamadas sin autorización.

## Registro

| Paso | Modo (real/simulado) | Estado (Pasa/Falla/No evaluado) | Evidencia y motivo | Pendiente |
|---|---|---|---|---|
| Preferencias | | No evaluado | | |
| Contexto | | No evaluado | | |
| Fuentes | | No evaluado | | |
| Dato ausente | | No evaluado | | |
| Streaming/detener | | No evaluado | | |
| Recarga | | No evaluado | | |
| Preparación D3 | | No evaluado | | |

## UI y evidencia

En la misma aplicación, revisa los estados de conversación a ~360 px y escritorio. Usa componentes existentes, mensajes accesibles, controles y avisos según el sistema de diseño; respeta `prefers-reduced-motion`. La demo no sustituye el check visual de cada estado. Al cerrar entrega proyecto sin secretos, resultados de prueba observados, ficha previa y pendientes D3. Ningún checklist vacío o guion preparado constituye evidencia.

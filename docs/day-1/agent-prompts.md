# Prompts secuenciales para trabajar D1 con el agente

Esta guía complementa el [roadmap D1](roadmap.md). El roadmap es la fuente de orden y estado; esta página no mantiene una matriz paralela. Usá un prompt de alcance y, después de revisarlo, un prompt de autorización para **un solo ID**. No mandes todos los incrementos juntos.

La preparación de Vercel y la explicación de permisos/riesgos de MCP forman parte de D1·B1, no de los incrementos de comportamiento: una conexión MCP es opcional, no instala dependencias de la app ni autoriza crear recursos o publicar. La publicación se trabaja en D3 en la cuenta personal del estudiante.

## Reglas para cada interacción

1. Trabajá en una copia propia del proyecto y del roadmap.
2. Elegí el primer incremento pendiente cuyos prerrequisitos estén comprobados.
3. El agente lee `AGENTS.md`, la fila del roadmap y la sección normativa indicada abajo.
4. Primero pedile que proponga el alcance sin editar. Revisá las rutas y checks.
5. Solo después autorizá explícitamente ese ID.
6. Al terminar, observá evidencia, registrala en tu roadmap y detenete. El agente no avanza por su cuenta.

Un `TODO(D1·B#...)` es una pista sobre un punto de extensión. No tiene autoridad para saltar un paso, cambiar el contrato o ejecutar el siguiente incremento.

## Incrementos y lectura requerida

| ID | Lectura además de `AGENTS.md` y roadmap | Prompt de objetivo (pegar en el paso de alcance) |
|---|---|---|
| D1·B1.1 | Setup desde carpeta vacía, parte A | «Necesito crear solo la raíz npm y declarar los workspaces frontend y API según B1.1. No incorpores todavía lógica de producto. ¿Qué archivos iniciales hacen falta y cómo comprobarías los workspaces?» |
| D1·B1.2 | Setup, parte B; `.env.example` y límites de secreto | «Necesito agregar solo la configuración base de TypeScript/Vite, scripts, configuración segura y `.env.example` según B1.2. No agregues chat ni conectes Groq. Identifica los archivos del bundle y los checks.» |
| D1·B1.3 | Referencia de interfaz D1 y mapa de archivos del bundle | «Necesito incorporar solo la presentación aprobada y los documentos públicos: pantalla vacía y componentes visuales con TODOs. No implementes comportamiento de chat. Explica qué se copia y qué verifica que siga siendo presentación.» |
| D1·B1.4 | Contrato API §health y setup, parte C | «Necesito implementar/comprobar solo GET /api/health y el proxy same-origin. No conectes Groq. Indica request, status/body esperados y cómo comprobar que no se usa CORS permisivo.» |
| D1·B2.1 | E1, contrato API: request y validación | «Necesito especificar y probar solo el contrato del mensaje actual por la API pública. Antes del comportamiento, propone pruebas deterministas y sus resultados observables. No implementes la ruta todavía.» |
| D1·B2.2 | Contrato API: validación, errores y gateway; arquitectura | «Necesito implementar solo validación HTTP y el límite de aplicación/gateway definido en el contrato. No conectes el proveedor real ni la UI. Rechaza lo inválido antes de invocar el fake.» |
| D1·B2.3 | Contrato API: Groq, configuración y errores del proveedor | «Necesito conectar el adaptador de Groq exclusivamente en el servidor, según contrato. No pongas claves en frontend ni llames al proveedor durante tests deterministas. Primero explica el manejo de configuración ausente.» |
| D1·B2.4 | E1 y contrato: respuesta; componentes de chat | «Necesito conectar el formulario de chat al endpoint y mostrar la respuesta. Enviar solo el mensaje actual; no historial, ubicación ni clave. No agregues todavía usage, ubicación ni reinicio.» |
| D1·B3.1 | Contrato API: errores recuperables/cuota; referencia de interfaz | «Necesito representar solo los errores de red/contrato y cuota agotada. Usa respuestas falsas para las pruebas; no generes errores reales de cuota ni reintentes automáticamente.» |
| D1·B3.2 | Contrato API: usage; tarifas fechadas en roadmap | «Necesito mostrar y acumular usage/costo según contrato. Prueba usage completo, parcial y ausente. Una respuesta válida no se pierde si falta usage y un campo desconocido no se convierte en cero.» |
| D1·B4.1 | E1 §mensaje de sistema; guía docente correspondiente | «Necesito preparar una comparación controlada de instrucciones de sistema con el mismo mensaje. No modifiques el contrato ni presentes una salida convincente como verificación factual. Explica qué evidencia registrar.» |
| D1·B5.1 | Todo el contrato D1 y E1 | «Necesito completar únicamente la cobertura determinista derivada del contrato, revisar RED → GREEN y regresiones de lo que tocamos. No agregues capacidades nuevas. Enumera requisito por requisito la evidencia faltante antes de editar.» |
| D1·B6.1 | E1 ubicación; API contract: solo mensaje; referencia de ubicación | «Necesito implementar ubicación con permiso o zona escrita, mantenida localmente. No enviar ubicación al endpoint ni al prompt. Prueba concedido, denegado y no disponible con APIs falsas.» |
| D1·B6.2 | E1 reinicio; uso acumulado; confirmación UI | «Necesito implementar solo confirmar/cancelar Nuevo plan. Confirmar limpia intercambios, ubicación/zona y usage de esta sesión; no cambia permisos, cuota, tema ni persistencia de datos ajenos.» |
| D1·B6.3 | Roadmap completo y guía de prueba docente solo si el facilitador la comparte | «Necesito cerrar los checks locales de D1, no ampliar alcance. Separa pruebas deterministas, health/arranque, build y llamada real. No afirmes llamada real si no se autorizó y observó.» |

## Prompt 1 — solicitar propuesta (antes de autorizar)

Copiá la fila del ID seleccionado y agregá:

```text
Vamos a trabajar únicamente en [ID]. Leé AGENTS.md, la fila completa del
roadmap y los documentos indicados. Todavía no edites ni ejecutes cambios.
Explicame el resultado observable, el concepto, las rutas que pensás tocar,
las pruebas/checks y cualquier ambigüedad. Esperá mi autorización explícita.
```

## Prompt 2 — autorizar una implementación acotada

Después de entender la propuesta y decidir seguir, copiá:

```text
Autorizo únicamente [ID] según el alcance que acabás de explicar.
Implementá solo ese incremento. Si hay pruebas deterministas aplicables,
primero escribe/ajusta la prueba y observa que falle; después implementa y
refactoriza manteniendo los checks en verde. No resuelvas TODOs de otros IDs,
no cambies contratos y no hagas commits, push ni llamadas reales al proveedor
salvo que este incremento las requiera y yo lo autorice explícitamente.
Reportá archivos, comandos, resultados, fallos y checks no ejecutados; no marques
el roadmap por mí ni avances automáticamente.
```

## Prompt 3 — registrar la evidencia

```text
Para [ID], resume solamente la evidencia observada: acción/comando exacto,
resultado, requisitos cubiertos y checks fallidos/no ejecutados. Indica si la
fila puede considerarse completada según sus criterios o qué queda pendiente.
No cambies el estado de otros incrementos.
```

La persona es responsable de actualizar su copia del roadmap tras comprobar el resultado. Si falta evidencia, mantiene el estado pendiente o bloqueado y vuelve a pedir ayuda dentro del mismo incremento; no salta al siguiente.

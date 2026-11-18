# Guía de trabajo en el aula — D1

Esta guía acompaña la implementación incremental; no contiene la solución ni las pruebas de aceptación completas. El facilitador autoriza cada bloque por separado. El roadmap y el [contrato API](../api-contract.md) son la fuente de alcance y comportamiento.

## Punto de entrada

Primero completa la [preparación del equipo](README.md), aunque ya hayas clonado. Después ejecuta B1.1–B1.4 tú mismo siguiendo el roadmap. El ciclo de dos prompts de esta guía comienza en B2.1; no se aplica a instalar herramientas.

## Antes de cada incremento

1. Abre `docs/day-1/roadmap.md` y elige con el facilitador un ID pendiente; confirma prerrequisitos y criterios completos.
2. Lee el documento público enlazado por esa fila y las reglas de `AGENTS.md`.
3. Copia en el agente el **prompt 1 (alcance)** de la ficha. Llega a ella desde el [índice de prompts del roadmap](../day-1/roadmap.md#prompts-para-copiar-ficha-por-ficha). Ya está completo: no hace falta modificarlo.
4. Comprueba que no falte una decisión. Si falta, detente y pregunta al facilitador.
5. Autoriza solo ese ID copiando el **prompt 2 (autorización)** de la misma ficha. No autorices varios bloques con una misma instrucción.

## Recorrido por los IDs del roadmap

Sigue el orden y las dependencias de la tabla oficial; una fila no es una autorización para la siguiente:

1. **D1·B1.1:** con las herramientas ya preparadas, instala las dependencias desde la raíz y verifica los workspaces; detente antes de B1.2.
2. **D1·B1.2:** revisa configuración, `.gitignore` y `.env.example` falso; detente antes de B1.3.
3. **D1·B1.3:** revisa plantillas y enlaces, inicia la presentación y confirma que no llama a Groq; detente antes de B1.4.
4. **D1·B1.4:** comprueba health/proxy sin clave; detente antes de B2.1.
5. **D1·B2.1:** fija mediante prueba el contrato del mensaje actual y observa RED; detente antes de B2.2.
6. **D1·B2.2:** revisa validación y gateway simulado, incluyendo entradas rechazadas sin llamada; detente antes de B2.3.
7. **D1·B2.3:** revisa configuración del servidor y ausencia de secreto en frontend; cualquier llamada real requiere autorización separada; detente antes de B2.4.
8. **D1·B2.4:** revisa envío del mensaje actual y respuesta en la interfaz; detente antes de B3.1.
9. **D1·B3.1:** revisa errores, reintento manual solo cuando corresponde y cuota sin reintento; detente antes de B3.2.
10. **D1·B3.2:** revisa usage completo/parcial/ausente y costo permitido; detente antes de B4.1.
11. **D1·B4.1:** compara instrucciones solo dentro del alcance autorizado y sin afirmar verificación factual; detente antes de B5.1.
12. **D1·B5.1:** revisa pruebas contractuales deterministas, límites, errores y evidencia RED/GREEN; detente antes de B6.1.
13. **D1·B6.1:** verifica permiso/alternativa manual y que ubicación no llegue a API/prompt; detente antes de B6.2.
14. **D1·B6.2:** revisa cancelar/confirmar y limpieza solo del estado de sesión; detente antes de B6.3.
15. **D1·B6.3:** ejecuta cierre local con mocks; una llamada real es opcional y separada. No declares evidencia real si no ocurrió.

## Durante el trabajo

1. Revisa que solo cambien las rutas acordadas y que no se adelante trabajo de otro ID.
2. Para comportamiento verificable, observa primero la prueba determinista fallar; después observa la misma prueba pasar con el cambio.
3. Mantén las pruebas dentro de interfaces públicas. Usa proveedor simulado; no pongas claves en pruebas, terminales compartidas, capturas ni Git.
4. Usa los comandos definidos en la fila/guía correspondiente. No instales paquetes adicionales ni realices llamadas a cuentas o proveedores como sustituto de pruebas locales.
5. Si el comando falla, conserva el resultado, revisa causa y limita la corrección al incremento autorizado.

## Al cerrar

1. Lee el informe de archivos, comandos exactos, resultados observados, fallos y comprobaciones pendientes.
2. Comprueba cada criterio del roadmap con evidencia: un reporte de agente o quitar un TODO no basta.
3. Anota el comando/acción y resultado en tu copia personal del roadmap. Solo tú decides el estado; si falta evidencia, queda pendiente.
4. Detente. Para el siguiente ID inicia un nuevo ciclo de propuesta, revisión y autorización.

## Paradas obligatorias

- Windows/OpenCode o una cuenta no disponible: registra la limitación; no declares ese entorno verificado.
- Solicitud de clave, pago, verificación de identidad o gasto no esperado: pausa y consulta al facilitador.
- Petición de historial, geolocalización en la API, catálogo, memoria de conversaciones, RAG, streaming, autenticación, instalación de CLI/MCP o despliegue antes del ID correspondiente: no la implementes. La instalación de Gentle AI durante la preparación del equipo, antes de B1.1, es la excepción: la realizas tú, en tu terminal, siguiendo su guía; no le pidas al agente que la haga.
- Una prueba simulada valida el contrato bajo el fake; no demuestra conectividad real con Groq.

Para preparación del entorno y cuentas, consulta [onboarding](README.md). Para solicitar trabajo incremental, usa los prompts de [agent-prompts.md](../day-1/agent-prompts.md).

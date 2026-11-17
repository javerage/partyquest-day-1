# Reglas para trabajar D1 con el agente

Esta guía complementa el [roadmap D1](roadmap.md). El roadmap es la única fuente del orden, del estado y de los prompts: cada incremento tiene ahí su ficha con el archivo que abres, el objetivo que envías al agente y la evidencia para cerrar. Esta página explica las reglas; no repite las fichas.

## Por qué se trabaja así

El proyecto se entrega con las decisiones de diseño tomadas: estructura de carpetas, nombres de archivos y funciones, tipos de los contratos, dependencias y textos de la interfaz. Cada `TODO(D1·B#.#)` dice qué falta, en qué archivo y qué documento lo define. Así el tiempo de la clase se dedica a entender el recorrido y a comprobar el resultado, no a elegir estructura. Las razones de esas decisiones se explican en clase y en la [arquitectura](../architecture.md).

## Reglas para cada interacción

1. Elige el primer incremento pendiente cuyos previos estén comprobados.
2. Abre el archivo que indica su ficha y lee el `TODO` con ese ID.
3. Envía el prompt de alcance con el objetivo de la ficha. El agente lee `AGENTS.md`, la ficha, los `TODO` y las lecturas, y explica sin editar.
4. Revisa que los archivos, pruebas y comprobaciones coincidan con la ficha.
5. Envía el prompt de autorización para **ese ID únicamente**.
6. Observa la evidencia, anótala en tu roadmap y detente. El agente no avanza por su cuenta.

Un `TODO(D1·B#.#)` es una pista sobre un punto de extensión. No autoriza a saltar un paso, a cambiar el contrato ni a ejecutar el siguiente incremento.

## Qué hacer si algo no coincide

| Situación | Qué hacer |
|---|---|
| El agente propone archivos, nombres o librerías distintos de los `TODO` | Pídele que se ajuste a la ficha; no autorices todavía |
| El agente dice que falta una decisión | No la inventes: consulta al facilitador y deja el incremento bloqueado |
| Una prueba falla después de implementar | Sigue en el mismo incremento; pide la causa antes de otro cambio |
| El agente quiere instalar algo o llamar a un proveedor | No lo autorices salvo que la ficha lo indique y tú lo decidas |
| El agente pide leer `api/.env` | No. Ese archivo es tuyo; el agente trabaja con `api/.env.example` y con valores falsos en las pruebas |
| No pudiste observar una comprobación | El incremento queda pendiente; anota por qué |

## Prompt para registrar la evidencia (opcional)

Tú decides el estado de cada fila. Si quieres un resumen antes de anotarlo:

```text
Para [ID], resume solamente la evidencia observada: acción o comando exacto,
resultado, requisitos cubiertos y comprobaciones fallidas o no ejecutadas.
Indica si la fila cumple sus criterios o qué queda pendiente. No cambies el
estado de otros incrementos.
```

## Lo que una conexión de herramientas no autoriza

Preparar las cuentas de Groq, Cohere y Vercel forma parte de D1·B1, no de los incrementos de comportamiento. Una conexión MCP es opcional: no instala dependencias de la aplicación ni autoriza a crear recursos o publicar. La publicación se trabaja en D3, en la cuenta personal de cada participante.

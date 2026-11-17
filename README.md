# PartyQuest — Día 1 del taller BotMode

¡Bienvenido! En este taller construirás una primera conversación con **Pachi**, el personaje de PartyQuest, con ayuda de **OpenCode**, un asistente de programación.

La pantalla y la estructura inicial del proyecto ya están preparadas para que puedas concentrarte en los ejercicios. Tú conectarás el chat, aprenderás a manejar sus respuestas y comprobarás su funcionamiento, paso a paso junto con el instructor.

## Empieza aquí

1. **Prepara tu equipo.** Sigue la [guía de preparación](docs/onboarding/README.md), que reúne la instalación de herramientas y la creación de cuentas. Si usas Windows, comienza por [instalar Node.js y OpenCode](docs/onboarding/windows.md).
2. **Comprueba las herramientas.** Ejecuta el [diagnóstico del equipo](#diagnóstico-del-equipo) y consulta al instructor si aparece algún problema.
3. **Abre la guía del taller.** Lee la [guía del aula](docs/onboarding/classroom-guide.md) y sigue la [hoja de ruta paso a paso](docs/day-1/roadmap.md). Allí encontrarás qué archivo abrir, qué pedirle a OpenCode y cómo revisar cada resultado.

Las guías de cuentas explican cómo preparar [Groq](docs/onboarding/groq.md), [Cohere](docs/onboarding/cohere.md) y [Vercel](docs/onboarding/vercel.md). Durante el primer día usarás Groq para conectar el chat; Cohere y Vercel se utilizarán en etapas posteriores.

## Qué vas a aprender

- Enviar un mensaje desde la pantalla y recibir una respuesta del modelo a través del servidor de PartyQuest.
- Mostrar cuándo Pachi está respondiendo y qué hacer si ocurre un error o se alcanza un límite de uso.
- Consultar el consumo de la conversación y comenzar un «Nuevo plan».
- Trabajar con una ubicación o zona local cuando llegues al ejercicio correspondiente.
- Pedir cambios acotados al asistente de programación y comprobarlos con pruebas.

El primer día se centra en esta primera conexión: cada petición envía el mensaje actual, sin historial ni ubicación. La búsqueda en un catálogo, las respuestas con fuentes, la voz y el guardado de conversaciones se trabajarán después. Por ahora, no tomes las respuestas del modelo como recomendaciones verificadas de lugares.

## Cómo usar los ejercicios

Los archivos contienen comentarios **`TODO`**: son marcas que indican el trabajo que realizarás durante el taller, no errores de instalación.

Para cada [ficha de la hoja de ruta](docs/day-1/roadmap.md#5-fichas-por-incremento):

1. Lee el objetivo y abre el archivo indicado.
2. Copia en OpenCode la instrucción propuesta en la ficha.
3. Revisa lo que propone el asistente y autoriza **solo ese paso**.
4. Comprueba el resultado antes de avanzar con el instructor.

No pidas al agente que complete todo el taller de una vez. Lo importante es entender cada cambio y comprobar qué hace. Las [reglas de trabajo con el agente](docs/day-1/agent-prompts.md) y las [skills incluidas](docs/onboarding/skills.md) —instrucciones especializadas para OpenCode— apoyan este proceso.

### Qué significan las claves de los archivos

En los comentarios y las guías encontrarás identificadores para localizar cada ejercicio:

| Clave | Significado |
|---|---|
| `D1` | Día 1 |
| `B1` | Bloque 1 del taller |
| `D1·B2.1` | Día 1, bloque 2, incremento 1: un paso concreto del ejercicio |

No necesitas memorizarlos. Cada ficha te indica cuál corresponde y dónde trabajar. Puedes consultar el [mapa de archivos y tareas](docs/day-1/template-file-map.md) si necesitas ubicarte.

## Material para consultar

- [Presentación del Día 1](docs/day-1/slides.html).
- [Bienvenida de Pachi](docs/day-1/pachi-intro.html).
- [Libro de consulta: del mensaje al modelo](docs/day-1/theory.html), para leer en el navegador o imprimir como PDF.
- [Referencia visual del chat](docs/day-1/interface-reference.html), para ver los estados que construirás.

Cuando una ficha lo indique, consulta también la [guía del ejercicio de conexión](docs/01-chat-integration.md), el [contrato de la API](docs/api-contract.md) —las reglas de comunicación entre pantalla y servidor— y la [arquitectura del proyecto](docs/architecture.md).

## Diagnóstico del equipo

Después de instalar Node.js, abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
node --version
npm.cmd --version
node ./scripts/check-environment.mjs
```

El diagnóstico revisa herramientas y archivos necesarios; no instala programas ni solicita claves. Si informa que falta algo, sigue la [guía de Windows](docs/onboarding/windows.md) o pide ayuda al instructor. La conexión con el modelo se comprobará en su ejercicio correspondiente.

## Comandos que usarás durante el taller

Ejecuta los comandos desde la carpeta principal del proyecto, cuando lo indique la guía. En PowerShell usamos `npm.cmd` para evitar problemas con la ejecución de scripts; no necesitas cambiar la política de seguridad de Windows. En macOS o Linux se escribe `npm` en su lugar.

| Comando en PowerShell | Para qué sirve |
|---|---|
| `npm.cmd ci` | Instalar las dependencias del proyecto |
| `npm.cmd run dev:api` | Iniciar el servidor en una terminal |
| `npm.cmd run dev:frontend` | Iniciar la pantalla en otra terminal |
| `npm.cmd test` | Ejecutar las pruebas que crearás durante los ejercicios |
| `npm.cmd run typecheck` | Revisar los tipos del código |
| `npm.cmd run build` | Comprobar que el proyecto puede compilarse |

Con ambos procesos iniciados, abre **http://127.0.0.1:5173** en el navegador. Al principio verás la pantalla preparada; el envío de mensajes se conectará durante los ejercicios. Mantén abiertas ambas terminales mientras trabajas.

## Cuida tus claves y tus cuentas

- Usa tus propias cuentas. No compartas claves de acceso, contraseñas ni tokens en OpenCode, capturas o mensajes del taller; tampoco los subas al repositorio.
- Configura la clave de Groq únicamente en el servidor, siguiendo la guía. La configuración de OpenCode y la de PartyQuest son distintas.
- Si una plataforma solicita un pago o un permiso inesperado, consulta al instructor antes de continuar. Las modalidades gratuitas y los límites pueden variar.
- No autorices al agente a publicar el proyecto, conectar repositorios o crear recursos remotos como parte de un ejercicio local.

**Tu siguiente paso:** abre la [guía de preparación](docs/onboarding/README.md).

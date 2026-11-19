# Día 2 · Bloque 4a — Integración contextual guiada

## Propósito y límites

El docente demuestra cómo Pachi interpreta seguimientos referidos a lugares mostrados. Después integras los cambios autorizados en tu mismo proyecto D2, conservando tu B4 y tus conversaciones. No es una app nueva, no se copia una solución de referencia y no se promete que el modelo interprete siempre bien. Los proveedores simulados prueban reglas del código, no calidad semántica.

El contrato contextual vigente define: lista mostrada de hasta tres IDs en orden visible; `shownPlaceIds` solo en turno `results`; lista vigente del resultado de búsqueda más reciente, invalidada por una búsqueda nueva incluso sin coincidencias; `conversation`, `clarification` y `answer` no la cambian. Referencias plurales/ordinales/nombre único se limitan o resuelven contra esa lista. Ambigüedad, ausencia de lista o ID irresoluble requiere aclaración. Turnos repetidos para ver otros avanzan acumulativamente y no repiten opciones. Historial contextual solo incorpora IDs/nombres del catálogo requeridos; no hechos, precios, distancias ni descripciones. `version: 1` se conserva al abrir y su migración a v2 debe ser explícita, probada con fixtures ficticios aislados y no borrar datos.

Los contratos exactos, esquemas, copy, límites conocidos y criterios A1–A4/S3–S22 forman la autoridad del curso. Este material no los sustituye: no alteres mensajes fijos ni esquemas a partir de este resumen; solicita el texto contractual vigente al docente si no está disponible. No distribuyas documentos instructorales, resultados privados ni solución.

## Demostración docente

Observa en el proyecto de demostración cómo se conserva el orden de lista, cómo ordinal/plural/nombre único se resuelven y cómo una referencia ambigua pide aclaración. Registra por separado lo observado y los límites conocidos. La demostración no afirma que la calidad real esté aprobada y no autoriza modificar tu proyecto.

## Integración: un incremento a la vez

1. Confirma que tu proyecto abre y que el trabajo B4 está guardado. No borres conversación ni reemplaces el proyecto.
2. Pide al agente propuesta sin cambios: contraste con tu implementación, rutas exactas, criterios, pruebas públicas y plan de protección/migración.
3. Revisa y autoriza explícitamente un único incremento y sus rutas. Si hay decisión de migración incierta, se detiene; no se resuelve reiniciando ni sobrescribiendo.
4. El agente prepara incrementalmente las pruebas y el cambio autorizado, sin ejecutar pruebas durante esta fase. La suite se ejecuta al cierre del ejercicio completo. Revisa el informe y detente antes de autorizar el siguiente incremento.

**Prompt de propuesta (sin autorización de edición):**
> Integro B4a en mi proyecto D2 existente y conservo B4. Sin editar, contrasta mi código con el contrato contextual vigente y propone únicamente el primer incremento: estado existente, rutas exactas, criterios observables, pruebas públicas con fixtures ficticios v1/v2 y cómo protegerás conversaciones reales. No borres, migres ni sobrescribas datos; no instales, llames proveedores, publiques ni hagas commits. Espera mi autorización explícita.

**Prompt de ejecución (solo tras autorización):**
> Autorizo únicamente el incremento y las rutas acordadas en tu propuesta. Prepara pruebas aplicables y realiza ese cambio sin ejecutar las pruebas durante la construcción. Preserva B4 y toda conversación existente; si aparece una decisión de migración no acordada, detente. No avances a otro incremento. Reporta criterios, pruebas preparadas, riesgos y evidencia no ejecutada.

## Protección y cierre

Nunca uses datos de producción o conversaciones reales como fixtures. Prueba formas v1/v2 en almacenamiento aislado. La migración se propone y revisa antes de autorizarla; no hay conversión silenciosa ni borrado. Comprueba que B4 conserva sus compactos y comportamiento. Prepara pruebas públicas de interpretación, IDs elegibles, preferencias, aclaraciones sin búsqueda y compatibilidad/persistencia. Ejecuta el conjunto completo solo al cierre del ejercicio y registra resultados observados; calidad semántica real queda separada y requiere autorización expresa para llamadas.

Conserva el patrón visual existente: burbujas de chat y `InlineNotice`; red/hook/presentación permanecen separados. Avisos bajo el campo, fila estable, mensajes accesibles. Revisión de navegador para estados relevantes a ~360 px y escritorio antes de afirmar UI verificada. Nada aquí acredita integración, pruebas ejecutadas ni calidad aprobada.

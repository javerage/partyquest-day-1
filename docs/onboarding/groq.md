# Preparar tu cuenta de Groq — Día 1

**Objetivo:** entrar con tu propia cuenta a GroqCloud y localizar dónde se administran las claves. Crear la cuenta no conecta todavía el ejercicio ni autoriza llamadas de pago.

## Pasos

1. Abre [GroqCloud](https://console.groq.com/) en tu navegador y verifica el dominio antes de introducir datos.
2. Si ya tienes cuenta, inicia sesión. Si no, selecciona el registro y utiliza uno de los métodos que el sitio ofrezca.
3. Completa la verificación de correo o identidad **solo si el sitio la solicita y entiendes sus condiciones**. No compartas códigos con el agente ni con el grupo.
4. Confirma que puedes entrar al panel de tu propia cuenta u organización.
5. Localiza [API Keys](https://console.groq.com/keys). Por ahora no necesitas generar una clave para instalar, arrancar la presentación o consultar health.
6. Revisa los límites y modelos disponibles en tu cuenta con el facilitador. No uses como garantía una cuota o un modelo que aparezca en una captura ajena.
7. Registra únicamente «acceso al panel comprobado», la fecha y cualquier bloqueo sin datos personales.

## Cuando llegues a D1·B2.3

Con ese incremento autorizado, crea una clave para el ejercicio desde la página oficial y guárdala únicamente como configuración local del **servidor**. El nombre previsto es `GROQ_API_KEY`; `GROQ_MODEL` selecciona el modelo que indique el contrato y que esté disponible en tu cuenta.

No pegues la clave en OpenCode, prompts, capturas, README, código, frontend, variables `VITE_*` ni Git. Un archivo local `.env` debe estar ignorado; no es cifrado. No se requiere una clave para las pruebas deterministas con proveedor falso. Una llamada real es una comprobación distinta, requiere autorización y puede consumir cuota.

Si una clave se expone, revócala en el proveedor y avisa al facilitador; borrar una línea de Git no revoca la clave.

## Checklist

- [ ] Entré al panel con mi propia cuenta.
- [ ] Localicé la sección de claves sin compartir ninguna.
- [ ] Entiendo que OpenCode puede necesitar **otro proveedor de programación**; esta cuenta no lo configura automáticamente.
- [ ] No hice llamadas ni acepté pagos durante la preparación.

Fuente: [Quickstart oficial de Groq](https://console.groq.com/docs/quickstart), consultado durante la preparación del 17 de noviembre de 2026. El alta, los permisos y la disponibilidad dependen del proveedor; no se promete gratuidad ni se ha ejecutado el flujo de tu cuenta. [Volver a preparación](README.md).

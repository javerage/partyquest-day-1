# Instalar Go en Windows

**Go** es un lenguaje de programación. En este taller **no programarás en Go**: lo necesitas solamente porque, en Windows, [Gentle AI](gentle-ai.md) se instala compilándolo con Go. Por eso esta guía va **antes** de la de Gentle AI.

Calcula unos 10 minutos. El instalador pesa alrededor de 65 MB: si puedes, descárgalo antes de la clase para no depender de la red del aula.

## Resultado esperado

En una terminal nueva de PowerShell, `go version` muestra la versión **1.25.10 o posterior**.

## 1. Revisa si ya tienes Go

Abre PowerShell y escribe:

```powershell
go version
```

- Si aparece algo como `go version go1.27.4 windows/amd64` y el número es **1.25.10 o mayor**, ya está listo. Continúa en el [paso 5](#5-comprueba-la-carpeta-de-programas-de-go).
- Si aparece una versión menor, sigue esta guía: el instalador reemplaza la versión anterior.
- Si PowerShell responde que no reconoce `go`, sigue esta guía.

> **Cómo comparar versiones:** compara número por número. `1.27.4` es mayor que `1.25.10` porque `27` es mayor que `25`. En cambio, `1.25.3` es **menor** que `1.25.10`, porque `3` es menor que `10`.

## 2. Identifica la arquitectura de tu equipo

Abre **Configuración → Sistema → Acerca de** y busca **Tipo de sistema**:

| Si dice… | Descarga el archivo que termina en |
|---|---|
| Sistema operativo de 64 bits, procesador basado en **x64** | `windows-amd64.msi` |
| Sistema operativo de 64 bits, procesador basado en **ARM** | `windows-arm64.msi` |

`amd64` es el nombre que usa Go para los procesadores x64 de Intel y AMD. La mayoría de las laptops con Windows usan este.

## 3. Descarga el instalador oficial

1. Abre la [página oficial de descargas de Go](https://go.dev/dl/). Descarga Go **solo** desde `go.dev`.
2. En **Featured downloads** o en la versión estable más reciente, elige el instalador **Microsoft Windows** con la terminación de tu arquitectura. Por ejemplo, el 17 de noviembre de 2026 la versión vigente era `go1.27.4.windows-amd64.msi`.
3. Guarda el archivo en tu carpeta **Descargas**.

Usa el archivo `.msi`, no el `.zip`: el instalador configura el sistema por ti.

### Opcional: comprueba que la descarga no se alteró

La página de descargas muestra una huella **SHA256** junto a cada archivo. En PowerShell, desde la carpeta de descargas:

```powershell
Get-FileHash .\go1.27.4.windows-amd64.msi -Algorithm SHA256
```

Cambia el nombre por el del archivo que descargaste. El valor `Hash` debe coincidir con el de la página, sin importar mayúsculas o minúsculas. Si no coincide, borra el archivo y descárgalo de nuevo.

## 4. Ejecuta el instalador

1. Haz doble clic en el archivo `.msi`.
2. Acepta la licencia y conserva la carpeta propuesta, normalmente `C:\Program Files\Go\`.
3. Windows puede pedir permiso para que el instalador haga cambios. Si tu cuenta no tiene ese permiso —por ejemplo, en un equipo de trabajo—, pide apoyo al instructor o al responsable del equipo; no intentes evitar la restricción.
4. Espera a que termine y pulsa **Finish**.
5. **Cierra todas las ventanas de PowerShell y abre una nueva.** Las terminales que ya estaban abiertas no ven los cambios del instalador.

Comprueba:

```powershell
go version
```

## 5. Comprueba la carpeta de programas de Go

Gentle AI quedará instalado en la carpeta de programas de Go de tu usuario. Revisa cuál es:

```powershell
go env GOPATH
```

Normalmente muestra `C:\Users\TU_USUARIO\go`. Los programas que instales con Go quedan en su subcarpeta `bin`, por ejemplo `C:\Users\TU_USUARIO\go\bin`.

Revisa que esa carpeta esté en tu PATH, la lista de carpetas donde Windows busca programas:

```powershell
$env:Path -split ';' | Select-String 'go\\bin'
```

Lo esperado son dos líneas: una con `C:\Program Files\Go\bin` y otra con la carpeta `go\bin` de tu usuario. El instalador suele agregar ambas.

Si falta la de tu usuario, agrégala:

1. Pulsa la tecla Windows y escribe **variables de entorno**.
2. Abre **Editar las variables de entorno de esta cuenta**.
3. En **Variables de usuario**, selecciona **Path** y pulsa **Editar**.
4. Pulsa **Nuevo** y escribe la ruta que mostró `go env GOPATH` seguida de `\bin`.
5. Acepta todas las ventanas. **No borres ni reemplaces las entradas existentes.**
6. Abre una terminal nueva y repite la comprobación.

## Lista de comprobación

- [ ] `go version` muestra 1.25.10 o posterior en una terminal nueva.
- [ ] `go env GOPATH` muestra una carpeta de tu usuario.
- [ ] La carpeta `go\bin` de tu usuario aparece en el PATH.

**Siguiente paso:** [instalar Gentle AI en OpenCode](gentle-ai.md#3-instalar-gentle-ai).

## Si algo falla

| Síntoma | Qué hacer |
|---|---|
| `go` no se reconoce después de instalar | Cierra **todas** las terminales y abre una nueva. Si persiste, reinicia la sesión de Windows. |
| `go version` muestra una versión antigua | Puede haber otra instalación de Go antes en el PATH. Ejecuta `Get-Command go -All` y comparte el resultado con el instructor. |
| El instalador pide permisos que no tienes | Pide apoyo; no uses instaladores de otras fuentes ni desactives protecciones del equipo. |
| Windows bloquea el archivo descargado | Confirma que lo descargaste de `go.dev` y, si quieres, compara su huella SHA256. Si sigue bloqueado, consulta al instructor. |
| Descargaste la arquitectura equivocada | El instalador falla o Go no se ejecuta. Revisa el paso 2 y descarga el archivo correcto. |

Para desinstalar Go más adelante: **Configuración → Aplicaciones → Aplicaciones instaladas**, busca **Go Programming Language** y elige **Desinstalar**.

> **En macOS** no necesitas Go para este taller: Gentle AI se instala con Homebrew, como indica su [guía](gentle-ai.md#3-instalar-gentle-ai).

Instrucciones basadas en la [guía oficial de instalación de Go](https://go.dev/doc/install), consultada el 17 de noviembre de 2026. Si la página oficial cambió, sigue sus indicaciones y avísale al instructor.

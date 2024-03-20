# Trabajo Práctico 0

> Versión 2.3.0

El TP0 es una práctica inicial para empezar a familiarizarse con algunas de las
herramientas necesarias para el trabajo práctico cuatrimestral como es la
configuración del entorno, el lenguaje Golang, etc. Es un ejercicio que sirve como
base para empezar el TP luego.

El TP0 va a ser realizado en **etapas**, cada una de ellas con un entregable que
servirá de base para la siguiente. La idea de este ejercicio es que lo realicen
de manera individual o grupal (no más de cinco, idealmente los mismos con los
que harán el TP cuatrimestral), y en unas semanas tendremos una entrega
**obligatoria**.

No es necesario tener el ejercicio completo y la entrega no lleva nota, pero
presentarse con lo que tengan en condición necesaria para la continuidad de la
materia. Más adelante publicaremos junto al enunciado del TP la fecha de entrega
de este ejercicio.

## Objetivo

El objetivo de este TP0 es empezar a familiarizarse con el entorno en el que
desarrollarán el TP de la materia, aprendiendo en el proceso cómo utilizar algunas
bibliotecas por su cuenta. La idea es, siguiendo este documento, logren completar
las funciones vacías y comentarios que les dejamos en el código.

::: tip

Pueden hacernos cualquier pregunta que tengan sobre el enunciado, o cualquier
otro concepto en los [medios de consulta de la práctica](/consultas).

:::

## Requisitos

- [Contar con un entorno Linux](/primeros-pasos/entorno-linux)
- Tener instalado golang y git
- Tener a mano el [repo del TP0](https://faq.utnso.com.ar/tp0-golang)

## Etapa 1: Setup inicial

### Crear un workspace

Primero, abramos una consola y, de la misma forma que bajamos el proyecto de las
commons, bajemos el del TP0:

```bash
git clone https://github.com/sisoputnfrba/tp0-golang
cd tp0
```

Luego, en el Visual Studio Code vamos a movernos hacia
`Archivo > Abrir carpeta ...`:

![open-folder](/img/primeros-pasos/tp0/open-folder.png)

Y vamos a seleccionar la carpeta donde clonamos el repositorio del TP0:

![select-folder](/img/primeros-pasos/tp0/select-folder.png)

## Etapa 2: Comandos básicos

El objetivo de esta etapa es aprender un par de funcionalidades que utilizaremos
bastante durante todo el desarrollo del trabajo práctico cuatrimestral.

### Logging

Durante todo el TP iremos logueando en un archivo de texto las diferentes
acciones que el programa vaya realizando, tanto las correctas, como los errores.
Para ello, utilizaremos las funciones de logging que proveen las biblioteca log.

Parados en el archivo `main.go`, si revisamos la primer linea se invoca la funcion `ConfigurarLogger`
del paquete `utils`.

Analizandola, vemos que:

- Loguee en el archivo "tp0.log"
- Muestre los logs por pantalla (y no solo los escriba en el archivo)

Creado nuestro logger, usemos `log.Println()` para loggear el string `"Soy un Log"`.

Parados en en el directorio `client`, podemos ejecutar el programa con el comando
`go run main.go`. Tambien podriamos compilar el programa `go build -o client main.go` y
luego ejecutar el binario `./client`

### Archivos de configuración

Estaría bueno que ese valor que logueamos no esté hardcodeado en el código, sino
que podamos configurarlo para que varíe sin tener que recompilar todo el
proyecto, por lo que vamos a leerlo a partir de un archivo de configuración y lo
vamos a loguear usando nuestro logger.

Para ello vamos a usar la biblioteca `encoding/json`.
Necesitamos abrir el archivo (`os.Open`) y luego desencodearlo `json.NewDecoder + Decode`.
Para hacer todo esto junto, creamos la funcion `utils.IniciarConfiguracion` que nos devuelve
una estrcutura `Config` con sus datos cargados del archivo `config.json`.
Ahora solo queda loggear el valor de la config `Mensaje`.

Compilamos, corramos el programa y evaluemos los resultados.

::: warning IMPORTANTE

Recuerden chequear los valores de los errores de las funciones y en este caso que la config no sea nil.

En este caso, si llegamos a tener algún error al crear el config vamos a querer
terminar con la ejecución:

```go
if globals.Config == nil {
    log.Fatalf("No se pudo cargar la configuración")
}
```

:::

### Leer de consola

De los comandos básicos, nos queda leer de consola. Si bien existen muchas
formas de hacerlo, vamos a usar la biblioteca `bufio`.

```go
reader := bufio.NewReader(os.Stdin)
text, _ := reader.ReadString('\n')
log.Print(text)
```

Esta porcion de codigo,va a hacer que el programa espere a que se ingrese una línea
y devolverla en un string ya listo para loggear.

### Strings

Terminando con esta etapa, nos gustaría que el TP0 lea de consola todas las
líneas que se ingresen, las loguee y, si se ingresa una línea vacía, termine con
el programa.

Pero... ¿cómo hacemos para revisar eso?

El fragmento de codigo anterior, lee hasta que se ingresa `\n` (un enter del teclado).
Tomaremos como string vacio el que contenga unicamente `\n`, y lo utlizaremos como **condición de corte**.

## Etapa 3: Programar el Cliente-Servidor

A partir de esta etapa, vamos a plantear una arquitectura
[cliente-servidor](https://es.wikipedia.org/wiki/Cliente-servidor). Para esta
sección, ambos `client` y `server` en sus respectivas carpetas tienen un archivo
`utils.go` con comentarios sobre lo que debemos hacer para poder conectar ambos
procesos mediante la red.

### Consigna

**El entregable de esta etapa es enviar al servidor el valor de CLAVE en el
archivo de configuración, y luego enviarle todas las líneas que se ingresaron
por consola juntas en un paquete.**

Simplificando un poco, una conexión http otro programa va a requerir de realizar lo siguiente:

- Iniciar el servidor en la función `http.ListenAndServe` del `server`.
- Configurar las rutas para los distintos mensajes, por ejemplo `mux.HandleFunc("/paquetes", utils.RecibirPaquetes)`
- Enviar como mensaje, con la funcion `utils.EnviarMensaje` el valor de CLAVE.
- Ir juntando las líneas que se leen por consola para luego enviarlas como
  paquete, con la funcion `utils.EnviarPaquete`.

### Funciones

Para simplificar el TP0, tenemos ya pre implementadas un par de funciones para
comunicarnos con el servidor en el paquete `utils`.

La única limitación es que estas funciones no nos sirven para enviar las líneas
de consola todas juntas, por lo que vamos a crear un paquete. Este paquete nos
va a asegurar que toda la información que mandemos se envíe junta. Para ello,
les proveemos otro conjunto de funciones o "API" para crear, rellenar y enviar
paquetes:

- `LeerConsola`: Recolecta lo ingresado por consola y lo acumula en un `Paquete`.
- `GenerarYEnviarPaquete`: Lee de consola y envia el paquete.

## Notas finales

El transcurso de esta guía de primeros pasos fue un poco largo, ¡pero
aprendimos un montón! Recapitulemos un poco:

- Pudimos configurar nuestro entorno de desarrollo.
- Aprendimos a usar funciones de bibliotecas que nos van a ser muy útiles.
- Aprendimos sobre leer por consola y enviar datos por red a otros programas.

Esto fue todo, pero recuerden que el TP0 es solo una introducción a todas las
herramientas que podemos usar.

Por lo tanto, les pedimos que consulten las guías y video tutoriales linkeados
en la pestaña de "Guías" de la barra de navegación de esta página para mejorar
constantemente y llegar bien holgados a fin de cuatrimestre.

**¡Hasta la próxima amigos!**

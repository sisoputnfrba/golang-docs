# Logging

Cuando desarrollamos software es muy común que querramos imprimir por pantalla
mensajes que nos ayuden a mostrar que nuestro programa está funcionando
correctamente.

Sin embargo, no todos los mensajes son igual de importantes: algunos van a ser
los mensajes **obligatorios** para la aprobación del TP, pero puede pasar que
durante el desarrollo el grupo quiera imprimir un par de mensajes de
**debug** para corroborar que estamos avanzando en la dirección correcta.

## Primera idea: agregarle funcionalidades a `fmt.Println`

Cuando llegue el momento de entregar el TP, vamos a tener que quitar estos
mensajes para no marear al ayudante que esté corrigiendo, pero si algo llega a
fallar estaría buenísimo poder volverlos a activar para poder ver qué es lo que
está pasando. Necesitaríamos algo como un flag `debug`:

```go
if debug {
    fmt.Println("Mensaje de debug")
}
```

Por otro lado, también estaría bueno que en las pruebas los mensajes no solo se
impriman por pantalla, sino también en un archivo de texto, para poder
revisarlos tranquilos luego de que el programa finalice:

```go
if debug {
    fmt.Fprintln(file, "Mensaje obligatorio")
} else {
    os.WriteFile("log.txt", []byte("Mensaje obligatorio"), os.ModeAppend)
}
```

Y, de paso, estaría bueno que los mensajes nos impriman la fecha y hora en la
que se generaron, para poder saber cuándo ocurrieron los eventos:

```go
if debug {
    fmt.Fprintln(file, time.Now().Format("2006-01-02 15:04:05"), "Mensaje obligatorio")
} else {
    os.WriteFile("log.txt", []byte(time.Now().Format("2006-01-02 15:04:05") + " Mensaje obligatorio"), os.ModeAppend)
}
```

Para simplificar un poco las cosas, podríamos crear una función que haga todo
esto más sencillo, pero... ¿no sería más fácil si Go ya nos proveyera de un
paquete que se encargue de hacerlo? :thinking:

## Una mejor idea: no reinventar la rueda

En el caso de Go, contamos con los paquetes `log` y `log/slog`, los cuales nos
permiten hacer todas estas cosas y muchas más de una forma muy sencilla:

1. Podemos imprimir mensajes de diferentes niveles de importancia usando
   funciones distintas para cada [Level] (`Debug`, `Info`, `Warning` y `Error`):

```go
slog.Debug("Mensaje de debug")
slog.Info("Mensaje informativo")
slog.Warning("Mensaje de advertencia")
slog.Error("Mensaje de error")
```

[Level]: https://pkg.go.dev/log/slog#Level

De esta forma, al momento de iniciar el programa podemos definir cuál es el
nivel de severidad más bajo que queremos que se imprima por pantalla:

```go
slog.SetLogLoggerLevel(slog.LevelInfo)
```

::: tip

Estos niveles se pueden extraer a una variable del archivo de configuración para
poder cambiarlo sin necesidad de recompilar el programa, usando el tipo
`slog.Level` para representarlos.

:::

2. Podemos cambiar el [File] en donde se van a guardar los mensajes, que
   por defecto es `os.Stdout`:

```go
file, err := os.Create("log.txt")
if err != nil {
    panic(err)
}
log.SetOutput(file)
```

[File]: https://pkg.go.dev/os#File

3. Podemos cambiar el formato en el que se imprimen los mensajes y agregarle
   información adicional, como el tiempo en milisegundos o la línea en la que se
   generó:

```go
log.SetFlags(log.Lmicroseconds | log.Lshortfile)
```

Con estas funcionalidades, ya tenemos todo lo necesario para poder imprimir los
logs obligatorios y a su vez sumarle mensajes de debug si es necesario.

::: warning IMPORTANTE

De todas formas, debemos tener en cuenta que los mensajes de debug no deberían
ser nuestra estrategia principal para encontrar errores en el código. Para esto,
es preferible utilizar herramientas como el debugger.

:::

Si quedó alguna duda sobre cómo utilizar `log/slog`, no duden en consultar la
documentación oficial de ambos paquetes:

- [Documentación de `log`](https://pkg.go.dev/log)
- [Documentación de `log/slog`](https://pkg.go.dev/log/slog)
- [Structured Logging with slog](https://go.dev/blog/slog)

Y, en caso de ser necesario, ya saben, estamos acá para ayudarlos. :wink:

## Extra: ¿por qué es importante tener logs?

En aplicaciones modernas, resulta fundamental contar con logs que nos ayuden a
comprender el estado interno del sistema a lo largo del tiempo. De esta forma,
en caso de surgir un error, el equipo a cargo puede usarlos para investigar por
qué el sistema falló en ese preciso momento.

Es por esto que `log/slog` también provee otras funcionalidades (que no vamos a
necesitar para el TP) como, por ejemplo:

- Permitir agregar campos adicionales a los mensajes, en forma de pares
  clave-valor:

```go
slog.Info("hello, world", "PID", os.Getpid())

=> 00:15:58.407298 main.go:41: INFO hello, world PID=154452
```

- Incluso permite generar un nuevo logger a partir del principal y agregarle
  dichos campos adicionales, que solo van a aplicar para esa ejecución en
  particular. Esto es útil cuando tenemos varios hilos ejecutándose en paralelo:

```go
miLog := slog.With("trace_id", generateTraceID())
miLog.Info("hello, world")

=> 00:15:58.407298 main.go:41: INFO hello, world trace_id=1234
```

- Utilizar formato JSON para los mensajes para, por ejemplo, enviar sus logs en
una base de datos y luego utilizar herramientas que procesen estos mensajes y
nos permitan buscar, filtrar y analizar la información de una forma más
eficiente:

```go
slog.Info("hello, world")

=> {"time":"2023-08-04T16:58:02.939245411-04:00","level":"INFO","msg":"hello, world"}
```

Esta capacidad de un sistema de poder comprender su estado interno analizando
los logs (junto con otras herramientas como métricas y trazas de ejecución) se
la conoce como [observabilidad].

Si bien en el TP no vamos a profundizar en este tema y solamente utilizaremos
logs para evaluar el correcto funcionamiento de cada módulo, esperamos que esta
sección les haya servido como punto de partida para investigar más sobre el tema
por su propia cuenta.

[observabilidad]: https://www.elastic.co/es/what-is/observability

# Hilos

Empecemos a hablar de la parte "divertida". ¿Qué es un hilo? Un hilo es una tarea que puede ser ejecutada al mismo tiempo que otra tarea. Esta tarea comparte recursos del proceso padre que lo ejecuta y existen herramientas para comunicar distintos hilos entre si.

Entonces... ¿Cuando usariamos un Hilo? Cuando nuestro programa tiene que hacer mas de una cosa al mismo tiempo. Hoy en día todas las aplicaciones que usan y/o conocen y usan habitualmente usan Hilos. Imaginense un Whatsapp que solo reciba o envie mensajes en un determinado momento.

Existen dos tipos de hilos. Los hilos de Kernel y los hilos de Usuario.

Por un lado, los hilos de kernel (como su nombre lo indica) son entidades de kernel y son administrador por el planificador del sistema operativo. Un hilo de kernel se ejecuta dentro de un proceso, pero cualquier otro hilo del sistema puede hacer referencia a él. El programador no tiene control directo sobre estos hilos sino que es el sistema operativo el encargado de planificarlo y administrarlo (excepto en determinadas situaciones que no viene al caso).

Por otro lado, un hilo de usuario es una entidad utilizada por los programadores para manejar varios flujos de controles dentro de un programa. Este hilo solo existe dentro de un proceso por lo que no puede hacer referencia a un hilo de otro proceso; El sistema operativo NO sabe que existen. Se gestionan sin soporte del Sistema operativo por lo cual este solo reconoce un hilo de ejecución. Por esta ultima razon, todas las operaciones descritas se llevan a cabo en el espacio de usuario de un mismo proceso y el kernel lo continua planificando como una unidad y asignándole un úunico estado.

Ahora... Por qué me estan explicando todo esto que vemos en la teoría?.
Bueno, hablemos de Golang.

Golang como todo lenguaje permite la creación a demanda de Hilos y a estos los llama ***"Rutinas"*** (A partir de ahora hablaremos de Rutinas para referirnos a los hilos creados por Golang). Estas rutinas son administradas por el motor de Golang, osea las rutinas que creemos son ***Hilos de usuario***. Dentro del motor existe un planificador (o Scheduler) que se encarga de planificar y administrar dichas rutinas dentro de ***hilos de kernel***. Hagamos una pausa. Miremos un diagrama

![Alt text](/img/threads-1.png "Threads 1")

En la imagen vemos dos hilos de kernel y 6 rutinas de Golang (osea, 6 hilos de usuario). El Scheduler de Golang internamente chequea en base a la cantidad de rutinas que tiene que ejecutar en paralelo y crea hilos de kernel a demanda para poder satisfacerlos.

Puedo estar explicando durante dos blogs mas como funciona el Scheduler de Golang pero no es el objetivo de este blog. Así que dejo un link al video de [GopherCon 2017](https://www.youtube.com/watch?v=KBZlN0izeiY&t=536s&ab_channel=GopherAcademy) en youtube donde se explica muy bien su funcionamiento.

## Rutinas Golang

Entonces. Una rutina de Golang es un hilo de usuario creado y administrado por go. Podemos iniciar un hilo usando la palabra **"go"** delante de la invocacion de una función. Veamos un ejemplo de comparativa

```go
package main

import (
	"fmt"
)

var valor int = 0

func main() {

	for i := 0; i < 20; i++ {
		thread()
	}
}

func thread() {
	valor++
	fmt.Println("Este es el hilo número", valor)
}
```

```txt
Este es el hilo número 1
Este es el hilo número 2
Este es el hilo número 3
Este es el hilo número 4
Este es el hilo número 5
Este es el hilo número 6
Este es el hilo número 7
Este es el hilo número 8
Este es el hilo número 9
Este es el hilo número 10
Este es el hilo número 11
Este es el hilo número 12
Este es el hilo número 13
Este es el hilo número 14
Este es el hilo número 15
Este es el hilo número 16
Este es el hilo número 17
Este es el hilo número 18
Este es el hilo número 19
Este es el hilo número 20
```

En este programa vemos que tenemos nuestro programa que ejecuta un for con un llamado a la función thread **sin** usar rutinas. Ahora hagamos lo mismo pero con generando una rutina por cada iteración.

```go
package main

import (
	"fmt"
	"time"
)

var valor int = 0

func main() {

	for i := 0; i < 20; i++ {
		go thread()
	}

	//Este tiempo es importante debido a que si el hilo
	//principal termina antes, los hilos no se
	//ejecutarán
	time.Sleep(101 * time.Second)
}

func thread() {
	valor++
	fmt.Println("Este es el hilo número", valor)
}
```

```txt
Este es el hilo número 2
Este es el hilo número 4
Este es el hilo número 5
Este es el hilo número 1
Este es el hilo número 6
Este es el hilo número 7
Este es el hilo número 8
Este es el hilo número 9
Este es el hilo número 10
Este es el hilo número 11
Este es el hilo número 11
Este es el hilo número 12
Este es el hilo número 13
Este es el hilo número 14
Este es el hilo número 15
Este es el hilo número 16
Este es el hilo número 17
Este es el hilo número 18
Este es el hilo número 19
Este es el hilo número 3
```

Bueno, varias cosas para ver...

Primero, vemos que agregamos la sentencia "go" adelante de la invocacion a la funcion "thread", esto lo que hizo fue que genere una rutina que atienda la ejecución de dicha función.

Segundo, vemos que como las rutinas son hilos "hijos" del proceso "main" y si dicha función finaliza las rutinas moriran (tambien finalizaran) por lo que agregamos un "Sleep" para lograr que dicha función no finalice antes que lo hagan sus rutinas.

Tercero, verificamos realmente que se ejecutan en hilos ya que el resultado ya no es deterministico y esto se debe a que existe una **condición de carrera**. Esta condición de carrera se da ya que todas las rutinas estan compitiendo por la utilización de la variable "valor" y debido a que los hilos son planificados, en primera instancia, por el Scheduler de Golang y, en segunda instancia, por el sistema operativo. La solución a este problema lo veremos en la siguiente sección...

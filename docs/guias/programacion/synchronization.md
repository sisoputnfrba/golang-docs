# Sincronización

Cuando hablamos de Sincronización nos estamos refiriendo a poder "coordinar" u "ordenar" dos acciones que pueden ocurrir al mismo tiempo. De esta manera, podemos ordenarlas u organizarlas de manera temporal para que solo una ocurra al mismo tiempo.

Dentro de Golang existen 3 principales herramientas de sincronización que cubren distintas situaciones que pueden ser requeridas a la hora de sincronizar nuestros proceso: `sync.WaitGroup`, `sync.Mutex` y Canales (`'chan'`)

## sync.WaitGroup

`sync.WaitGroup` se utiliza para esperar la finalizacion de un grupo de rutinas. Permite que una goroutine espere hasta que todas las rutinas en el grupo hayan completado su ejecución. Este metodo **NO se puede utilizar para sincronizar recursos**.

Su sintaxis utiliza los metodos `Add`, `Done` y `Wait`. `Add` incrementa el contador, `Done` decrementa el contador, y `Wait` bloquea hasta que el contador llega a cero.

Un ejemplo de su sintaxis

```go
var wg sync.WaitGroup

for i := 0; i < 3; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        // Hacer algún trabajo
        // ...
    }(i)
}

// Esperar a que todas las goroutines completen
wg.Wait()
```

## sync.Mutex

`sync.Mutex` se utiliza para lograr exclusión mutua y evitar condiciones de carrera en secciones criticas del código. Garantiza que solo una rutina pueda acceder a una sección crítica a la vez.

Su sintaxis utiliza el método `Lock` para adquirir el candado y `Unlock` para liberarlo.

Un ejemplo de su sintaxis es:

```go
var mu sync.Mutex

// Sección crítica protegida por el mutex
mu.Lock()
// Acciones en la sección crítica
mu.Unlock()
```

## Canales ('chan')

Los canales se utilizan para la comunicación y sincronización entre rutinas. Permite desde coordinar y sincronizar secciones criticas hasta el envío y la recepción de datos entre rutinas.

Los canales se crean con `make(chan Tipo)` y se pueden utilizar para enviar (`<- ch`) y recibir (`ch <-`) datos

Un ejemplo de su sintaxis:

```go
ch := make(chan int)

go func() {
    // Hacer algún trabajo
    // ...
    ch <- 42 // Enviar datos al canal
}()

// Recibir datos del canal
valor := <-ch
```

Los canales tambien pueden ser usados como semaforos o para controlar el accesso a recursos compartidos. No esta diseññados especificamente para la comunicación, sino para controlar el acceso de múltiples rutinas a una sección crítica. Los semáforos mantienen un recuento que permite que un cierto número de rutinas accedan a una sección crítica simultáneamente.

Un ejemplo de su sintaxis:

```go
sem := make(chan struct{}, MaxGoroutines)
for i := 0; i < MaxGoroutines; i++ {
    go func(id int) {
        // Hacer algún trabajo
        // ...
        <-sem // Liberar el semáforo cuando se complete
    }(i)
}
```

## Cómo elegir que usar 

`sync.WaitGroup` se utiliza principalmente para esperar la finalización de un conjunto específico de rutinas antes de continuar la ejecución. Útil cuando el número de rutinas es conocido de antemano.

`sync.Mutex` se utiliza para lograr la exclusión mutua y evitar condiciones de carreras

`chan` se utiliza sin necesitass comunicación y sincronización entre rutinas o si necesitas controlar el acceso a un recurso compartido.

## Volviendo a nuestro ejemplo

Volviendo a nuestro ejemplo de la sección anterior (adjunto a continuación):

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

```Output
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

Teniamos varios puntos a revisar. Empecemos...

Inicialmente estamos usando un `time.Sleep` que nos permitía "esperar" hasta que las rutinas finalicen para que nuestra función principal no finalice y con ella nuestras rutinas. El problema que nos trae esto es que si nuestras rutinas tardan mas en ejecutar que nuestro tiempo de `time.Sleep` terminamos en el mismo problema inicial ya que nuestra función main finalizaría antes que ellas. Con lo visto hasta ahora, podemos empezar cambiando esto por un `sync.WaitGroup`. Veamos...

```go
package main

import (
	"fmt"
	"sync"
)

var valor int = 0
var wg sync.WaitGroup

func main() {

	for i := 0; i < 20; i++ {
		// Agrego uno al WaitGroup antes de comenzar cada rutina
		wg.Add(1)
		go thread()
	}

	// Esperar a que todas las rutinas finalicen
	wg.Wait()
}

func thread() {
	// Indico que al finalizar la función thread tiene que liberar un valor de wg
	defer wg.Done()

	valor++
	fmt.Println("Este es el hilo número", valor)
}
```

```Output
Este es el hilo número 1
Este es el hilo número 2
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
Este es el hilo número 17
Este es el hilo número 16
Este es el hilo número 19
Este es el hilo número 18
Este es el hilo número 20
Este es el hilo número 3
```

Como vemos en el ejemplo incorporamos cuatro cosas a nuestro codigo. Inicializamos la variable global `var wg sync.WaitGroup` para definir el WaitGroup a utilizar, usamos la sentencia `wg.Add(1)` previo a ejecutar cada rutina para contar cuantas de ellas estamos creando, agregamos un `defer wg.Done()` que nos indica que al finalizar la función se debe liberar un recurso de wg y `wg.Wait()` que nos permite esperar hasta que el contador de wg llegue a 0.

Llegado a este momento ya tenemos soluciónado nuestro problema del Sleep pero no de nuestra región crítica. Para eso vamos a primero resolver esto con `sync.Mutex`. Veamos...

```go
package main

import (
	"fmt"
	"sync"
)

var valor int = 0
var wg sync.WaitGroup
var mutex sync.Mutex

func main() {

	for i := 0; i < 20; i++ {
		wg.Add(1)
		go thread()
	}

	wg.Wait()
}

func thread() {
	defer wg.Done()

	//Obtenemos el candado de mutex
	mutex.Lock()
	valor++
	fmt.Println("Este es el hilo número", valor)
	//Soltamos el candado de mutex
	mutex.Unlock()
}
```

```Output
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

En este ejemplo vemos como aplicamos una exclusión mutua en dentro de la rutina en particular. Esto nos permite que solo una rutina entre al mismo momento en la region donde se añade un valor a nuestro variable y se imprime por pantalla arreglando la condición de carrera que teniamos. Para la utilización de esto hicimos tres cosas: `var mutex sync.Mutex` para definir la veriable global mutex, `mutex.Lock()` para obtener la llave del candado y `mutex.Unlock()` para liberar dicha llave. Podemos ver así que nuestra región crítica termina quedando definida en lo que se encuentra entre `mutex.Lock()` y `mutex.Unlock()`.

Bien, resolvimos nuestros problemas... Pero que podemos hacer con los canales. Veamos la misma solución de mutex pero con canales...

```go
package main

import (
	"fmt"
	"sync"
)

var valor int = 0
var wg sync.WaitGroup
var sem = make(chan int, 1)

func main() {

	for i := 0; i < 20; i++ {
		wg.Add(1)
		go thread()
	}

	wg.Wait()
}

func thread() {
	defer wg.Done()

	//Obtenemos el candado de mutex
	sem <- 0
	valor++
	fmt.Println("Este es el hilo número", valor)
	//Soltamos el candado de mutex
	<-sem
}
```

```Output
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

Como habiamos dicho previamente, los canales son utilizados como semaforos y si mutex es un semaforo de valor 1 entonces podemos representar un mutex con un canal. En este ejemplo vemos eso y para ello usamos 3 cosas: `var sem = make(chan int, 1)` que inicializa un semaforo que recibira un entero y que solo tiene una instancia de paralelismo (lo que define que es un mutex), `sem <- 0` que obtiene la instancia del semaforo (en este caso es la llave del mutex) y `<-sem` que suelta dicho recurso.

## Productor Consumidor

Bien, veamos un ejemplo ahora de todo lo que hicimos en conjunto. aplicando mutex y semaforos. Para esto vamos a hacer un ejercicio de productor consumidor en el cual pueda haber un stock de hasta tres elementos en el mercado y el consumidor vaya consumiendo. Cabe aclarar que este programa no tendra un corte asi que lo dejaremos correr un rato y luego lo finalizaremos desde la consola con `Ctrl+C`

```go
package main

import (
	"fmt"
	"sync"
)

var valores []int
var valor = 0
var wg sync.WaitGroup
var mutex sync.Mutex
// Incializamos el semaforo del productor en 3 para tener hasta 3 recursos en el mercado
var sem_productor = make(chan int, 3)
// Inicializamos el semaforo consumidor en 0 ya que no tenemos recursos en el mercado
var sem_consumidor = make(chan int)

func main() {

	// Ejecutamos 5 productor
	for i := 0; i < 5; i++ {
		wg.Add(1)
		go productor()
	}

	// Ejecutamos 5 consumidores
	for i := 0; i < 5; i++ {
		wg.Add(1)
		go consumidor()
	}

	// Esperamos a que finalicen todas las rutinas
	wg.Wait()
}

func productor() {
	defer wg.Done()

	for true {
		// Consumimos un semaforo de productor que permite hasta 3 recursos
		sem_productor <- 0

		// Entramos en la sección critica de nuestro mercado, Las variables valor y valores
		mutex.Lock()
		valores = append(valores, valor)
		fmt.Println("Producimos el valor ", valor)
		valor++
		mutex.Unlock()
		
		// Informamos a consumidores que tienen un recurso en el mercado
		<-sem_consumidor
	}
}

func consumidor() {
	defer wg.Done()

	for true {
		// Tomo un recurso del mercado
		sem_consumidor <- 0

		// Entro en mi sección critica de la variable valores
		mutex.Lock()
		fmt.Println("Consumimos el valor ", valores[0])
		valores = valores[1:]
		mutex.Unlock()

		// Aviso al productor q tiene un lugar libre en el mercado
		<-sem_productor
	}
}
```

```Output
...
Producimos el valor  1963
Consumimos el valor  1961
Producimos el valor  1964
Consumimos el valor  1962
Producimos el valor  1965
Consumimos el valor  1963
Producimos el valor  1966
Consumimos el valor  1964
Producimos el valor  1967
Consumimos el valor  1965
Consumimos el valor  1966
Consumimos el valor  1967
Producimos el valor  1968
Producimos el valor  1969
Consumimos el valor  1968
Producimos el valor  1970
Consumimos el valor  1969
...
```

Como vemos en este ejemplo, estamos combinando las 3 herramientas de sincronización. Usamos `sync.WaitGroup` para esperar a que nuestros productores y consumidores finalicen y no se cierre la función main. Usamos `sync.Mutex` para la región crítica y garantizar la mutua exclusión de las variables globales "valor" y "valores" y usamos dos semaforos inicializados en 0 y en 3 para manejar los productores y consumidores.
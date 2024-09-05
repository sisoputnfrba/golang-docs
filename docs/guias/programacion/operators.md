# Operadores

Un operador representa un símbolo (o conjunto de ellos) que permite realizar operaciones aritméticas, relacionar elementos o hacer preguntas donde se involucra más de una condición. Todos los lenguajes de programación poseen una lista de ellos y dependiendo el mismo cambia su sintaxis. En esta sección explicaremos los distintos operadores que posee Golang

## Operadores Aritméticos

### Operador Postfix

Son operadores de incremento y decremento que permiten agregar el valor de uno o eliminar el valor de uno. A continuación un ejemplo:

Incremento:

```go
package main

import "fmt"

func main() {
	var i int = 10
	i++
	fmt.Println("Resultado", i)
}
```

```txt
Resultado 11
```

Decremento:

```go
package main

import "fmt"

func main() {
	var i int = 10
	i--
	fmt.Println("Resultado", i)
}
```

```txt
Resultado 9
```

### Operadores Signo

Permiten el cambio de signo de una variable. A continuación un ejemplo

```go
package main

import "fmt"

func main() {
	var i int = 10
	fmt.Println("+i =", +i)
	fmt.Println("-i =", -i)
}
```

```txt
+i = 10
-i = -10
```

### Operadores de complemento

Permiten realizar el complemento de una variable. El operador `^` realiza el complemento de una variable bit a bit y el complemento `!` permite la negación. A continuación dos ejemplos:

Complemento:

```go
package main

import "fmt"

func main() {
	var i int = 2
	fmt.Println("^i = ", ^i)
}
```

```txt
^i =  -3
```

Negación:

```go
package main

import "fmt"

func main() {
	var i bool = true
	fmt.Println("!i =", !i)
}
```

```txt
!i = false
```

### Operador Suma/Resta

```go
package main

import "fmt"

func main() {
	var i int = 10
	var k int = 5

	fmt.Println("i + k = ", i+k)
	fmt.Println("i - k = ", i-k)
}
```

```txt
i + k =  15
i - k =  5
```

### Operador Multiplicación/División/Resto

```go
package main
import "fmt"

func main() {
	var i int = 10
	var k int = 3

	fmt.Println("i * k = ", i * k)
	fmt.Println("i / k = ", i / k)
	fmt.Println("i % k = ", i % k)
}
```

```txt
i * k =  30
i / k =  3
i % k =  1
```

### Otros operadores

Golang posee otros operadores como son los de Exponente, y desplazamiento que a fines de nuestra materia no vamos a utilizar. Para mas información, pueden consultarse en la documentación del lenguaje.

## Operadores Relacionales

Los operadores relacionales en go son los siguientes <,>, <=, >=, ==, !=

```go
package main
import "fmt"

func main() {
	var i int = 4
	var j int = 2
	var k int = 4

	fmt.Println("i < j = ", i < j)
	fmt.Println("i > j = ", i > j)
	fmt.Println("i >= j = ", i >= j)
	fmt.Println("i <= j = ", i <= j)
	fmt.Println("i == j = ", i == j)
	fmt.Println("i != j = ", i != j)
	fmt.Println("i < k = ", i < k)
	fmt.Println("i > k = ", i > k)
	fmt.Println("i >= k = ", i >= k)
	fmt.Println("i <= k = ", i <= k)
	fmt.Println("i == k = ", i == k)
	fmt.Println("i != k = ", i != k)
}
```

```txt
i < j =  false
i > j =  true
i >= j =  true
i <= j =  false
i == j =  false
i != j =  true
i < k =  false
i > k =  false
i >= k =  true
i <= k =  true
i == k =  true
i != k =  false
```

## Operadores Condicionales

Los operadores condicionales nos permitirán relacionar dos condiciones. En go existen los operadores AND y OR. Veamos un ejemplo

```go
package main

import "fmt"

func main() {
	var azul bool = true
	var amarillo bool = true
	var rojo bool = false

	fmt.Println("Verde = ", azul && amarillo)
	fmt.Println("Violeta = ", azul && rojo)
	fmt.Println("Naranja = ", amarillo && rojo)

	fmt.Println("Daltonico = ", amarillo || rojo || azul)
	fmt.Println("No me juzguen, soy Daltonico")
}
```

```txt
Verde =  true
Violeta =  false
Naranja =  false
Daltonico =  true
No me juzguen, soy Daltonico
```

## Operadores de Asignación

Los operadores de asignacion nos permiten realizar una operacion y asignar a nuestra variable el resultado de dicha operación. En go estos operadores son: =, +=, -=, *=, /=, %=, &=, ^=, <<=, >>=. A continuación un ejemplo de algunos de los mas utilizados.

```go
package main
import "fmt"

func main() {
	var i int = 10
	i += 5

	fmt.Println("i += 5 is ", i)

	i -= 3
	fmt.Println("i -= 3 is ", i)

	i *= 4
	fmt.Println("i *= 4 is ", i)

	i /= 2
	fmt.Println("i /= 2 is ", i)
}
```

```txt
i += 5 is  15
i -= 3 is  12
i *= 4 is  48
i /= 2 is  24
```

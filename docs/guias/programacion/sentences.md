# Sentencias

En esta seccion hablaremos de las diferencias sentencias que posee Golang. Las sentencias nos permitirán realizar declaraciones condicionales y bucles en nuestro programa. Empecemos...

## IF THEN

Como su nombre lo indica nos permitirá hacer una declaración condicional.

```go
package main
import "fmt"

func main() {
	var edad int = 15
	if edad < 18 {
		fmt.Println("Menor de edad!")
	}
}
```

```txt
Menor de edad!
```

Para entender esto, volvamos un poco a Algoritmos base, la logica del if es la siguiente:

```txt
+---------+
|  Start  |
+---------+
     |
	 V
	+-------------------+
	| Condition			|-----------+
	+-------------------+			|
		|							|
		| True						| False
		| 							|
		V							|
	+-----------------+				|
	|  Statements	  |				|
	+-----------------+				|
		|							|
		|							|
		V							|
+---------+							|
|  End	  |-------------------------+
+---------+
```

## IF THEN ELSE

La sentencia ELSE nos permitirá tomar una acción en caso que no se cumpla la condicion inicial.

```go
package main
import "fmt"

func main() {
	var edad int = 19;
	if edad < 18 {
		fmt.Println("Menor de edad!")
	} else {
		fmt.Println("Mayor de edad!")
	}
}
```

```txt
Mayor de edad!
```

Volvamos a ver como se modificaría nuestro diagrama de algoritmos.

```txt
+---------+
|  Start  |
+---------+
     |
	 V
	+-------------------+
	| Condition			|-----------+
	+-------------------+			|
		|							|
		| True						| False
		| 							|
		V							|
	+-----------------+				|
	|  Statements	  |				|
	+-----------------+				|
		|							|
		|							V
		V				   +--------------------+
+---------+				   |					|
|  End	  |<---------------|  Else Statements	|
+---------+				   +--------------------+
```

## IF THEN ELSE IF ELSE

Por ultimo podemos empezar a encadenar IF en la medida que no se cumpla nuestras condiciones. Miremos un ejemplo

```go
package main
import "fmt"

func main() {
	var edad int = 76;
	if edad < 18 {
		fmt.Println("Menor de edad!")
	} else if(edad < 75) {
		fmt.Println("Mayor de edad!")
	} else {
		fmt.Println("Jubilado")
	}
}
```

```txt
Jubilado
```

## Sentencia SWITCH

La sentencia switch como su nombre lo indica es una sentencia de caso. Esta sentencia toma una expresión y la evalúa. Por cada posible resultado ejecuta las correspondientes sentencias mientras que el caso predeterminado se ejecuta si alguno de los casos no se satisface.

```go
package main

import "fmt"

func main() {
	funcionCase("A")
	funcionCase("D")
	funcionCase("J")
}

func funcionCase(a string) {
	switch a {
	case "A":
		fmt.Println("Abeja")
	case "B":
		fmt.Println("Baskett")
	case "C":
		fmt.Println("Codigo")
	case "D":
		fmt.Println("Dado")
	default:
		fmt.Println("No se que es!")
	}
}
```

```txt
Abeja
Dado
No se que es!
```

Volviendo un poco a algoritmos expresemos esto en un diagrama.

```txt
+-----------------------+
|  Switch (expression)  |
+-----------------------+
     |
	 V
	+-------------------+	True	 +-----------------------------+
	| Condition	1		|----------->|	Statements for Condition 1 |----+
	+-------------------+			 +-----------------------------+	|
		| False															|
		| 																|
		V																|
	+-------------------+	True	 +-----------------------------+	|
	| Condition	2		|----------->|	Statements for Condition 2 |----+
	+-------------------+			 +-----------------------------+	|
		| False															|
		| 																|
		V																|
	+-------------------+	True	 +-----------------------------+	|
	| Condition	n		|----------->|	Statements for Condition n |----+
	+-------------------+			 +-----------------------------+	|
		| False															|
		| 																|
		V																|
	+-------------------+	True	 +-----------------------------+	|
	| Default			|----------->|	Default Statements		   |----+
	+-------------------+			 +-----------------------------+	|
		| False															|
		| 																|
		V																|
	+-----------------+													|
	|	  End		  |<------------------------------------------------V
	+-----------------+
```

## Sentencia FOR

La sentencia For nos permitira realizar un bucle. Recibe 3 parametros, el primero es la inicializacion del iterador, la segunda es la condición por la cual el bucle se sigue ejecutando y la tercera es el icrementador del iterador. Veamos un ejemplo

```go
package main
import "fmt"

func main() {
	for i:=0; i < 10; i++ {
		fmt.Print(i, " ")
	}
}
```

```txt
0 1 2 3 4 5 6 7 8 9
```

Expresemos esto en un diagrama de algoritmos.

```txt
+---------+
|  Start  |
+---------+
     |
	 V
+---------+
|  i = 1  |
+---------+
     |
	 V
	+----------+
----|  i < 10  |<----------------
|	+----------+				|
|		| True					|
|		V						|
|	+----------------------+	|
|	|  Program Statements  |-----
|	+----------------------+
|False
|
V
+---------+
|  End	  |
+---------+
```

## Sentencia WHILE

Bien... Golang no posee sentencia While como la definida en la mayoria de los lenguajes sino que el mismo se hace con una condicion FOR con un solo parametro. Su funcionamiento es igual al conocido normalmente. Veamos un ejemplo:

```go
package main

import "fmt"

func main() {
	i := 0
	for i < 10 {
		fmt.Print(i, " ")
		i++
	}
}
```

```txt
0 1 2 3 4 5 6 7 8 9
```

Para finalizar, vemos el diagrama algoritmico de como funciona esta sentencia:

```txt
+---------+
|  Start  |
+---------+
     |
	 V
	+----------+
----| condition|<----------------
|	+----------+				|
|		| True					|
|		V						|
|	+----------------------+	|
|	|  Program Statements  |-----
|	+----------------------+
|False
|
V
+---------+
|  End	  |
+---------+
```

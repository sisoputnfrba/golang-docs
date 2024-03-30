# Protocolo HTTP

El HTTP (del inglés HyperText Transfer Protocol o Protocolo de Transferencia de Hiper Textos) es el protocolo de transmisión de información de internet, es decir, el código que se establece para que el computador solicitante y el que contiene la información solicitada puedan “hablar” un mismo idioma a la hora de transmitir información por la red.

Como todo protocolo, se mantiene criterios de sintaxis y semántica tanto que permiten lograr la comunicación entre los diferentes elementos que se encuentran en internet: servidores, clientes, proxies, etc. Se trata de un protocolo “sin estado”, vale decir, ya que no lleva registro de visitas anteriores sino que siempre empieza de nuevo. La información relativa a visitas previas se almacena en estos sistemas en las llamadas “cookies”, almacenadas en el sistema cliente.

Es un "lenguaje" que media entre las peticiones del cliente y las respuestas del servidor en la Internet, para permitir una comunicación fluida y en un mismo “lenguaje”. Este protocolo establece las pautas a seguir, los métodos de petición (llamados “verbos”) y cuenta con cierta flexibilidad para incorporar nuevas peticiones y funcionalidades, en especial a medida que se avanza en sus versiones.

El funcionamiento del protocolo se basa en un esquema de petición-respuesta entre el servidor web y el “agente usuario” (del inglés user agent) o cliente que realiza la solicitud de transmisión de datos utilizando los distintos verbos que proporciona el lenguaje. Estos verbos son: GET, POST, PATCH, PUT, DELETE.

Para el pasaje de información existen tres alternativas diferentes: `query path` esto implica agregar la información en la ruta implicitamente, `query param` agregar la información como una variable en la ruta explicitamente y, `body` que es el pasaje de información en un formato definido entre cliente-servidor. Conociendo esto, tenemos que saber que el parametro `body` solo se encuentra disponible para los verbos PUT, POST y PATCH.

## En nuestro trabajo práctico

El protocolo será utilizado como medio de comunicación entre los distintos módulos y como input para las distintas pruebas definidas en el trabajo práctico. Cabe resaltar, que toda comunicación no definida explicitamente en el enunciado del trabajo práctico queda a libre definición del alumno.

## En Golang

Golang posee abstracciones que permiten trabajar el protocolo a alto nivel, es decir, no tener que realizar la comunicación y el intercambio de mensajes como lo hace el protocolo (esto pasa en la mayoría de los lenguajes de programación).

Para esto, se utiliza la biblioteca `net/http` que nos permitirá generar distintos puntos de entrada (o Endpoints) o realizar distintas peticiones en caso de ser cliente. Empecemos a ver distintos ejemplos.

### Server-Side

#### Ejemplo base

Veamos primero un ejemplo base

```go
package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	http.HandleFunc("GET /helloworld", HelloWorld)
	http.ListenAndServe(":8080", nil)
}

func HelloWorld(w http.ResponseWriter, r *http.Request) {

	respuesta, err := json.Marshal("Hola! Como andas?")
	if err != nil {
		http.Error(w, "Error al codificar los datos como JSON", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(respuesta)
}
```

En este ejemplo vemos como indicamos a nuestro codigo que va a tener un endpoint en `GET /helloworld` y será administrado por la función `HelloWorld`. Por otro lado, vemos que definimos que nuestro server estará en el puerto "8080" definido a través de la funcion `http.ListenAndServe` la cual inicializa y levanta nuestra aplicación. Cabe aclarar que ejecutar esta función hará que nuestro proyecto al correrlo "no finalice" ya que la misma deja un hilo escuchando en un socket del puerto "8080".

Dentro de la función `HelloWorld` usamos la biblioteca `encoding/json` que transforma un json en formato byte y utilizarlo posteriormente en la respuesta. Para retornar utilizamos `w.WriteHeader(http.StatusOK)` para indicar que el estado de respuesta es OK y `w.Write(respuesta)` con el contenido de la misma.

Por último, para probar nuestro código, tan solo debemos ir a un navegador de nuestra computadora e ingresar a `http://localhost:8080/helloworld`. Por default cuando ingresamos desde navegador a un ruta se ejecuta el verbo GET lo que nos permitirá ver en la pantalla lo siguiente:

![server-get-01](/img/guias/programacion/http-protocol/server-get-01.png)

#### Query Path

Ahora veamos un ejemplo de como usar un `query path`. Para esto tenemos el siguiente ejemplo:

```go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("GET /helloworld/{name}", HelloWorld)
	http.ListenAndServe(":8080", nil)
}

func HelloWorld(w http.ResponseWriter, r *http.Request) {
	name := r.PathValue("name")

	respuesta, err := json.Marshal(fmt.Sprintf("Hola %s! Como andas?", name))
	if err != nil {
		http.Error(w, "Error al codificar los datos como JSON", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(respuesta)
}
```

Veamos que en este ejemplo tenemos dos cambios. El primero es que en la definición de nuestro handler tenemos un `GET /helloworld/{name}` definiendo que en nuestra ruta luego de helloworld vendrá un string que representará la variable name. Dentro de nuestra función obtenemos dicha variable a traves de `r.PathValue("name")` y la asignamos a la variable interna `name` de la función para posteriormente utilizarla en la respuesta. Veamos así un ejemplo:

![server-get-02](/img/guias/programacion/http-protocol/server-get-02.png)

#### Query Param

Ahora veamos un ejemplo con un `query param`

```go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("GET /helloworld", HelloWorld)
	http.ListenAndServe(":8080", nil)
}

func HelloWorld(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	name := queryParams.Get("name")

	respuesta, err := json.Marshal(fmt.Sprintf("Hola %s! Como andas?", name))
	if err != nil {
		http.Error(w, "Error al codificar los datos como JSON", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(respuesta)
}
```

En este ejemplo vemos que en la definición del verbo no tenemos cambios ya que el `query param` no afecta a su definición. Por otro lado, vemos que si tenemos cambios dentro de nuestra función HelloWorld. Aca vemos que primero definimos la variable `queryParam` como `r.URL.Query()` que nos permitirá acceder a aquellas variables definidas en la ruta. Luego usamos `queryParams.Get("name")` para obtener la variable name y utilizarla dentro de nuestra respuesta.

![server-get-03](/img/guias/programacion/http-protocol/server-get-03.png)

#### Body

Para hacer este ejemplo con `body` tendremos que tener varias cosas en cuenta:

1. Utilizaremos el verbo POST ya que GET no tiene permitido el uso del mismo
2. No podremos realizarlo directamente desde el navegador por lo que utilizaremos la aplicación Postman que nos permitirá ejecutar los distintos verbos.

Dicho esto, veamos el ejemplo:

```go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type BodyRequest struct {
	Name string `json:"name"`
}

func main() {
	http.HandleFunc("POST /helloworld", HelloWorld)
	http.ListenAndServe(":8080", nil)
}

func HelloWorld(w http.ResponseWriter, r *http.Request) {
	var request BodyRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	respuesta, err := json.Marshal(fmt.Sprintf("Hola %s! Como andas?", request.Name))
	if err != nil {
		http.Error(w, "Error al codificar los datos como JSON", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(respuesta)
}
```

En este ejemplo vemos varios cambios. El primero es que necesitamos declarar un struct que nos permitirá definir el formato nuestro `body` que recibiremos. Dentro del mismo cada propiedad deberá tener la definición `json:"name"` donde `name` sera el nombre dentro del JSON que enviaremos. Luego dentro de nuestro método HelloWorld deberemos transformar el body que recibimos (en formato String) en nuestro struct a traves de `json.NewDecoder(r.Body).Decode(&request)` siendo request una variable del tipo de nuestro struct. Luego utilizaremos la propiedad para imprimirla.

![server-post-01](/img/guias/programacion/http-protocol/server-post-01.png)

### Client-Side

Bueno, vimos varios ejemplos de un servidor. Ahora haremos un ejemplo de un cliente que consume las API's que armamos. Para esto, haremos un ejemplo por cada tipo de dato que enviamos.

#### Query Path

```go
package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	cliente := &http.Client{}
	url := fmt.Sprintf("http://localhost:8080/helloworld/pepe")
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return
	}

	req.Header.Set("Content-Type", "application/json")
	respuesta, err := cliente.Do(req)
	if err != nil {
		return
	}

	// Verificar el código de estado de la respuesta
	if respuesta.StatusCode != http.StatusOK {
		return
	}

	bodyBytes, err := io.ReadAll(respuesta.Body)
	if err != nil {
		return
	}

	fmt.Println(string(bodyBytes))
}
```

```Output
"Hola pepe! Como andas?"
```

En este ejemplo vemos como hacer un pedido GET enviando un parametro a través de `query path`. Para ello utilizamos la funcion `http.NewRequest` indicandole el verbo, la url y el body (en este caso nulo, osea nil). Luego definimos el lenguaje del request, siempre utilizaremos `application/json` y ejecutamos la operación con la funcion `cliente.Do`. Esta función nos da la respuesta a nuestro pedido HTTP, por lo que validamos que el StatusCode recibido realmente sea el OK y luego transformamos el string que recibimos para mostrarlo en pantalla.

#### Query param

```go
package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	cliente := &http.Client{}
	url := fmt.Sprintf("http://localhost:8080/helloworld")
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return
	}

	q := req.URL.Query()
	q.Add("name", "pepe")
	req.URL.RawQuery = q.Encode()

	req.Header.Set("Content-Type", "application/json")
	respuesta, err := cliente.Do(req)
	if err != nil {
		return
	}

	// Verificar el código de estado de la respuesta
	if respuesta.StatusCode != http.StatusOK {
		return
	}

	bodyBytes, err := io.ReadAll(respuesta.Body)
	if err != nil {
		return
	}

	fmt.Println(string(bodyBytes))
}
```

```Output
"Hola pepe! Como andas?"
```

En este ejemplo vemos que para enviar query param debemos primero obtener la URL de nuestro pedido con `req.URL.Query()`, luego agregarle la variable con su valor y finalmente definir el query a traves de `req.URL.RawQuery = q.Encode()`.

#### Body

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type BodyRequest struct {
	Name string `json:"name"`
}

func main() {
	body, err := json.Marshal(BodyRequest{
		Name: "pepe",
	})
	if err != nil {
		return
	}

	cliente := &http.Client{}
	url := fmt.Sprintf("http://localhost:8080/helloworld")
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return
	}

	req.Header.Set("Content-Type", "application/json")
	respuesta, err := cliente.Do(req)
	if err != nil {
		return
	}

	// Verificar el código de estado de la respuesta
	if respuesta.StatusCode != http.StatusOK {
		return
	}

	bodyBytes, err := io.ReadAll(respuesta.Body)
	if err != nil {
		return
	}

	fmt.Println(string(bodyBytes))
}
```

```Output
"Hola pepe! Como andas?"
```

En este ejemplo vemos que primero debemos transformar nuestro objeto en un texto plano, para esto utilizaremos el mismo struct que en el ejemplo server y lo transformaremos con `json.Marshal`. Luego al momento de ejecutar el request enviaremos el string resultante en formato de bytes con la función `bytes.NewBuffer(body)`.

### Ejemplo con Objeto de Request y Response

En este ejemplo veremos como hacer para devolver desde un servidor un objeto y obtenerlo desde un cliente. Cabe aclarar que este ejemplo es una combinacion de "Marshal" y "Unmarhal" ya vistos.

```go server
// server.go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type BodyRequest struct {
	Name string `json:"name"`
}

type BodyResponse struct {
	Mensaje string `json:"message"`
}

func main() {
	http.HandleFunc("POST /helloworld", HelloWorld)
	http.ListenAndServe(":8080", nil)
}

func HelloWorld(w http.ResponseWriter, r *http.Request) {
	var request BodyRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var respBody BodyResponse = BodyResponse{
		Mensaje: fmt.Sprintf("Hola %s! Como andas?", request.Name),
	}

	respuesta, err := json.Marshal(respBody)
	if err != nil {
		http.Error(w, "Error al codificar los datos como JSON", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(respuesta)
}
```

```go client
// client.go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type BodyRequest struct {
	Name string `json:"name"`
}

type BodyResponse struct {
	Mensaje string `json:"message"`
}

func main() {
	body, err := json.Marshal(BodyRequest{
		Name: "pepe",
	})
	if err != nil {
		return
	}

	cliente := &http.Client{}
	url := fmt.Sprintf("http://localhost:8080/helloworld")
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return
	}

	req.Header.Set("Content-Type", "application/json")
	respuesta, err := cliente.Do(req)
	if err != nil {
		return
	}

	// Verificar el código de estado de la respuesta
	if respuesta.StatusCode != http.StatusOK {
		return
	}

	var response BodyResponse
	err = json.NewDecoder(respuesta.Body).Decode(&response)
	if err != nil {
		return
	}

	fmt.Println(response.Mensaje)
}
```

Como vemos en el ejemplo hemos agregado varias cosas:

1. En ambos hemos generado el struct de la respuesta que utilizaremos
2. En el server se arma el objeto de respuesta y reemplazamos el Marshal del string por dicho objeto
3. En el cliente armamos un nuevo Decoder pasandole el body de la respuesta e indicandole que lo guarde en una variable del tipo de la respuesta.
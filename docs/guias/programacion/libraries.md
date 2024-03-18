# Bibliotecas / Funciones Compartidas

Como vimos en la sección anterior nos va a empezar a pasar que vamos a tener codigo "duplicado" en varios lugares o momentos de nuestro trabajo práctico. Para evitar el famoso `copy/paste` podemos empezar a usar bibliotecas o funciones compartidas. Para esto, crearemos un nuevo archivo con un nuevo paquete (o package) que contendra aquellas funciones o estructuras compartidas permitiendonos:

1. Evitar hacer `copy/paste`
2. Tener centralizada la logica de manera que si se debe modificar solo se haga en un lugar en especifico.

Para esto, veamos como quedaria nuestro Servidor y Cliente.

```go
//client.go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/sisoputnfrba/golang-induction/libraries/lib"
)

func main() {
	body, err := json.Marshal(lib.BodyRequest{
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

	var response lib.BodyResponse
	err = json.NewDecoder(respuesta.Body).Decode(&response)
	if err != nil {
		return
	}

	fmt.Println(response.Mensaje)
}
```

```go
//server.go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/sisoputnfrba/golang-induction/libraries/lib"
)

func main() {
	http.HandleFunc("POST /helloworld", HelloWorld)
	http.ListenAndServe(":8080", nil)
}

func HelloWorld(w http.ResponseWriter, r *http.Request) {
	var request lib.BodyRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var respBody lib.BodyResponse = lib.BodyResponse{
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

```go
//lib.go

package lib

type BodyRequest struct {
	Name string `json:"name"`
}

type BodyResponse struct {
	Mensaje string `json:"message"`
}
```

Bien, veamos que tenemos un nuevo archivo que se llama `lib.go` que nos permitirá definir nuestras estructuras compartidas y utilizarlas en los otros dos proyectos archivos/módulos. De esta manera, en los otros dos importaremos el módulo `lib` y utilizaremos su funciones a través de `lib.BodyRequest` y `lib.BodyResponse`.

Por otro lado, les recordamos que pueden ver y bajar este ejemplo desde el siguiente [link](https://github.com/sisoputnfrba/golang-induction/tree/main/docs/libraries). En dicho ejemplo encontrarán varios archivos que veremos y explicaremos en la sección de "Estructura de proyecto".

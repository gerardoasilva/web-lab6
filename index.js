let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();
let uuidv4 = require("uuid/v4");

let app = express();

app.use(express.static('public'));
app.use(morgan("dev"));

/*

let comentario = {
    id: uuid.v4(),
    titulo: string,
    contenido: string,
    autor: string,
    fecha: Date
}

*/

let comentarios = [
  {
    id: uuidv4(),
    titulo: "Pienso, luego existo",
    contenido:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, aperiam! Eum dolorum consectetur ratione, vitae laudantium eius, quisquam omnis quidem quibusdam eos libero commodi ipsa!",
    autor: "Aurturo Manríquez",
    fecha: "2020-01-23"
  },
  {
    id: uuidv4(),
    titulo: "La cruda realidad",
    contenido:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, aperiam! Eum dolorum consectetur ratione!",
    autor: "Elizabeth Morales",
    fecha: "2020-01-23"
  },
  {
    id: uuidv4(),
    titulo: "¡La mejor obra de teatro!",
    contenido:
      "Adipisicing elit. Qui, aperiam! Eum dolorum consectetur ratione, vitae laudantium eius, quisquam omnis ipsa!",
    autor: "La Rosalía",
    fecha: "2020-01-23"
  },
  {
    id: uuidv4(),
    titulo: "No puede haber una mejor representación...",
    contenido:
      "Lorem dantium eius, quisquam omnis quidem quibusdam eos libero commodi ipsa!",
    autor: "Genaro García",
    fecha: "2020-01-23"
  }
];

// Función que retorna fecha actual
function getFecha() {
  var d = new Date(),
    day = "" + d.getDate(),
    month = "" + d.getMonth() + 1,
    year = "" + d.getFullYear();

  return [year, month, day].join("-");
}

// GET METHODS
app.get("/blog-api/comentarios", (req, res) => {
  return res.status(200).json(comentarios);
});

app.get("/blog-api/comentarios-por-autor", (req, res) => {
  if (req.query.autor) {
    let autor = req.query.autor;

    let resultado = comentarios.filter(elemento => {
      if (elemento.autor === autor) {
        return elemento;
      }
    });

    if (resultado.length > 0) {
      return res.status(200).json(resultado);
    } else {
      res.statusMessage = "El autor " + autor + " no tiene comentarios";
      return res.status(404).send();
    }
  } else {
    res.statusMessage = "Dato faltante";
    return res.status(406).send();
  }
});

// POST METHOD
app.post("/blog-api/nuevo-comentario", jsonParser, (req, res) => {
  let titulo = req.body.titulo;
  let contenido = req.body.contenido;
  let autor = req.body.autor;

  if (titulo != "" && contenido != "" && autor != "") {
    let comentario = {
      id: uuidv4(),
      titulo: titulo,
      contenido: contenido,
      autor: autor,
      fecha: getFecha()
    };
    comentarios.push(comentario);
    res.statusMessage = "El comentario ha sido agregado exitosamente";
    return res.status(201).send(comentario);
  } else {
    res.statusMessage = "No es posible agregar el comentario, datos faltantes";
    return res.status(406).send();
  }
});

// DELETE METHOD
app.delete("/blog-api/remover-comentario/:id", (req, res) => {
  let id = req.params.id;

  console.log(id);

  let resultado = comentarios.find(elemento => {
    if (elemento.id === id) {
      return elemento;
    }
  });

  if (resultado) {
    console.log(comentarios);
    comentarios.splice(comentarios.indexOf(resultado), 1);
    console.log(comentarios);
    return res.status(200).send();
  } else {
    res.statusMessage = "No se encontró el comentario con id: " + id;
    return res.status(404).send();
  }
});

// PUT METHOD
app.put("/blog-api/actualizar-comentario/:id", jsonParser, (req, res) => {
  let idParam = req.params.id;
  let idBody = req.body.id;
  let titulo = req.body.titulo;
  let contenido = req.body.contenido;
  let autor = req.body.autor;

  if (idBody != "") {
    if (idParam == idBody) {
      if (titulo != "" || contenido != "" || autor != "") {
        let resultado = comentarios.find(elemento => {
          if (elemento.id === idParam) {
            return elemento;
          }
        });

        let index = comentarios.indexOf(resultado);

        if (resultado) {
          if (titulo != "") {
            comentarios[index].titulo = titulo;
          }
          if (contenido != "") {
            comentarios[index].contenido = contenido;
          }
          if (autor != "") {
            comentarios[index].autor = autor;
          }

          return res.status(202).send(comentarios[index]);
        } else {
          res.statusMessage = "No existe el comentario con id: " + idParam;
          return res.status(404).send();
        }
      } else {
        res.statusMessage = "No hay datos para actualizar";
        return res.status(406).send();
      }
    } else {
      res.statusMessage = "ID de JSON no coincide con ID en URL";
      return res.status(409).send();
    }
  } else {
    res.statusMessage = "ID faltante";
    return res.status(406).send();
  }
});

app.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080...");
});

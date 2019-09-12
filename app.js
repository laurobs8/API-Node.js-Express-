const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')


// Configurar bodyParser
app.use(bodyParser.json())


//Configuração MongoDb
mongoose.connect("mongodb://localhost/api-node", {
  useNewUrlParser: true,
}, () => {
  console.log("banco de dados conectado")
})

//Carregando model de produto
require("./model/Produto")
const Produto = mongoose.model("Produto")


// Endpoints

// Cadastro
app.post("/produto", (req, res) => {
  if (req.body.nome != undefined && req.body.fabricante != undefined && req.body.preco != undefined) {
    var produto = new Produto({
      nome: req.body.nome,
      fabricante: req.body.fabricante,
      preco: req.body.preco
    })
    produto.save().then(() => {
      // Dado salvo com sucesso
      res.statusCode = 201
      res.send()

    }).catch((err) => {
      if (err) {
        throw err
      }
      res.statusCode = 417
      res.send()
      // So entra aqui se houver alguma falha
    })
  } else {
    res.statusCode = 406
    res.send("Nao válido")
  }
})


// Listar Produtos

app.get("/produtos", (req, res) => {
  Produto.find({}, (erro, dados) => {
    if (erro) {
      res.statusCode = 417
      res.send("erro em listar")
    }
    res.json(dados)
  })
})

// Listar por id

app.get("/produto/:id", (req, res) => {
  Produto.findById(req.params.id).then((produto) => {
    res.statusCode = 200
    res.json(produto)
  }).catch((erro) => {
    if (erro) {
      res.statusCode = 417
      res.send()
      throw erro
    }
  })
})

// Tentar Update
app.put("/produto/:id", (req, res) => {
  Produto.findByIdAndUpdate(req.params.id, {
    nome: req.body.nome,
    fabricante: req.body.fabricante,
    preco: req.body.preco
  }, {new: true}).then((produto) => {
    if (produto) {
      res.statusCode = 200
      res.send()
      produto.save()
    } else {
      res.statusCode = 404
      res.send()
    }
  }).catch((erro) => {
    res.statusCode = 417
    res.send()
    throw erro
  })
})


// Deletar

app.delete("/produto/:id", (req, res) => {
  Produto.findByIdAndDelete(req.params.id).then((produto) => {
    if (produto) {
      res.statusCode = 200
      res.send()
    } else {
      res.statusCode = 404
      res.send()
    }
  }).catch((erro) => {
    res.statusCode = 417
    res.send()
    throw erro
  })
})

app.listen(8080, () => {
  console.log('API Funcionando');
})
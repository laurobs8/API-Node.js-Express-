const mongoose = require('mongoose')

mongoose.model("Produto", {

  nome: {type: String},
  fabricante: {type: String},
  preco: { type: Number}

})
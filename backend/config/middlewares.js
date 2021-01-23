const bodyParser = require('body-parser');
const cors = require('cors');

/* Exportando uma função arrow ao qual o app é passado por parâmetro para injetar as dependências, e após isso, retornar o app em index.js */
module.exports = app => {
    /* Definindo os middlewares */
    app.use(bodyParser.json());
    app.use(cors());
}
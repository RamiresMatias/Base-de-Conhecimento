const app = require('express')();//Fazendo o require para o express e o invocando com função direta
const consign = require('consign');
const db = require('./config/db.js');
const mongoose = require('mongoose');

require('./config/mongodb.js');

app.db = db;
app.mongoose = mongoose;

/* Chamada do consign para ler os arquivos abaixo e incluir as configurações neles definidas em app */
consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./schedule')
    .then('./config/routes.js')
    .into(app);

app.listen(4000, () => {
    console.log('<------------ BACKEND RODANDO ------------>')
})
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/knowledge_stats', { useNewUrlParser: true })
    .catch(error => {
        const msg = "Não foi possível conectar no MongoDB!";
        /* Utilizando Node console colors para alterar a cor de background da mensagem no console.log. 
        Os caracteres  '\x1b[41m' indica que background será vermelho
        E os '\x1b[0m' indica que a fonte das letras irá resetar, ficando branco.
        Se não resetar, todos os logs que forem escritos após esse log ficarão vermelho*/
        console.log('\x1b[41m', msg, '\x1b[0m');
    });
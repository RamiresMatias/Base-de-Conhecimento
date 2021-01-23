const { authSecret } = require('../.env');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {

    /* Função de login. Após login o usuário recebe um token com data de expiração */
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe o usuário e senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if (!user) return res.status(400).send('Usuário não encontrado!');

        /* Função para fazer a comparação da senha recebida no body da requisição e comparar com a senha
        do usuário no banco, como ela está criptografa o bcrypt descriptografa e faz a comparação e depois retorna */
        const isMath = bcrypt.compareSync(req.body.password, user.password);

        if (!isMath) return res.status(401).send('Email/Senha inválido!')

        /* Variável   */
        const now = Math.floor(Date.now() / 1000);


        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,//Variável que armazena a data de token emitido
            /* Variável com data de expiração do token. Como está em milisegundos soma com 60 segundos x 60 minutos x 24 horas x 3 dias */
            exp: now + (60 * 60 * 24 * 3)
        }

        /* Gerando o token para o usuário poder fazer a requisição */
        res.json({
            ...payload,
            /* Utilizando o jwt para codificar o token, e para codificar também precisa do authSecret*/
            token: jwt.encode(payload, authSecret)
        })
    }

    /* Função para validar token */
    const validateToken = async (req, res) => {
        const userData = req.body || null

        try {
            if (userData) {
                const token = jwt.decode(userData.token, authSecret)
                /* Se a data de expiração do token for maior que a data atual, significa que o token está válido */
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (error) {
            res.status(500).send(error);
        }
        res.send(false);
    }
    return { signin, validateToken };
}
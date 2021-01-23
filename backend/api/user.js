const bcrypt = require('bcrypt-nodejs');

module.exports = app => {

    const { existsOrError, notExistsError, equalsError } = app.api.validation;

    const excryptedPassword = password => {
        /* o salt serve para que a mesma senha durante a criptografia não seja igual, por mais que duas senhas sejam iguais
        seu hash não será. */
        const salt = bcrypt.genSaltSync(10);

        return bcrypt.hashSync(password, salt);
    };

    /* O mesmo método save servirá tanto para salvar um novo registro, como para alterar um existente */
    const save = async (req, res) => {
        const user = { ...req.body };
        /* caso venha um id pelos parâmetros, o objeto user receberá esse id */
        if (req.params.id) {
            user.id = req.params.id;
        }

        try {
            /* Validando se os dados enviados */
            existsOrError(user.name, 'Nome não informado!')
            existsOrError(user.email, 'E-mail não informado!')
            existsOrError(user.password, 'Senha não informada!')
            existsOrError(user.passwordConfirm, 'Senha confirmada inválida!');
            equalsError(user.password, user.passwordConfirm, 'Senhas não conferem!');

            /* Fazendo um select na tabela users para validar se existe algum usuário com o mesmo e-mail */
            const userDb = await app.db('users').where({ email: user.email }).first();

            /* Caso não tenha id, envia para a função com mensagem */
            if (!user.id) {
                notExistsError(userDb, 'Usuário já cadastrado');
            }

        } catch (error) {
            /* Caso gere algum erro durante as validações ele retorna uma mensagem */
            return res.status(400).send(error);
        }

        user.password = excryptedPassword(user.password);
        delete user.passwordConfirm;

        if (user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .then(() => {
                    res.status(200).send()
                })
                .catch(error => res.status(500).send(error));
        } else {
            app.db('users')
                .insert(user)
                .then(() => res.status(201).send())
                .catch(error => res.status(500).send(error));
            ;
        }
    }

    const remove = async (req, res) => {
        try {
            const articles = await app.db('articles')
                .where({ userId: req.params.id })
                .first()
            notExistsError(articles, "Usuário possui artigos.")

            const rowsUpdated = await app.db('users')
                .update({ deletedAt: new Date() })
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, "Usuário não foi encontrado")

            res.status(200).send();
        } catch (error) {
            res.status(400).send(error);
        }
    }

    /* Função para retornar todos os usuários, ou retornar um usuário por Id */
    const get = async (req, res) => {
        const userId = req.params.id;
        if (userId) {
            app.db('users')
                .where({ id: userId })
                .whereNull('deletedAt')
                .then(user => res.json(user))
                .catch(error => res.status(500).send(error));
        } else {

            app.db('users')
                .select('id', 'name', 'email', 'admin')
                .whereNull('deletedAt')// O campo precisa estar nulo para trazer os usuários
                .then(users => res.json(users))
                .catch(error => res.status(500).send(error));
        }
    }

    return { save, get, remove }

}
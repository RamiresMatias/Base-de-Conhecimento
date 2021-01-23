const queries = require('./queries.js')

module.exports = app => {

    const { existsOrError, notExistsError } = app.api.validation;

    const save = (req, res) => {
        let article = { ...req.body };

        if (req.params.id) article.id = req.params.id;

        try {

            existsOrError(article.name, "Nome não informado");
            existsOrError(article.description, "Descrição não informada");
            existsOrError(article.categoryId, "Categoria não informado");
            existsOrError(article.userId, "Autor não informado");
            existsOrError(article.content, "Conteúdo não informado");

        } catch (error) {
            res.status(400).send(error);
        }

        if (article.id) {
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .then(() => res.status(200).send())
                .catch(error => res.status(500).send(error))
        } else {
            app.db('articles')
                .insert(article)
                .then(() => res.status(200).send())
                .catch(error => res.status(500).send(error));
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('articles')
                .where({ id: req.params.id })
                .del()

            try {
                existsOrError(rowsDeleted, "Artigo não foi encontrado")
            } catch (msg) {
                res.status(400).send(msg)
            }
            res.status(200).send();
        } catch (error) {
            res.status(500).send(error);
        }
    }

    const limit = 10 // limite usado para paginação

    const get = async (req, res) => {

        if (req.params.id) {
            app.db('articles')
                .where({ id: req.params.id })
                .first()
                .then(article => {
                    /* O content é gravado em binário, logo precisa ser convertido em string para depois retornar em json */
                    article.content = article.content.toString()
                    return res.json(article)
                })
                .catch(error => res.status(500).send(error))
        } else {
            const page = req.query.page || 1

            const result = await app.db('articles').count('id').first()
            const count = parseInt(result.count)

            app.db('articles')
                .select('id', 'name', 'description')
                .limit(limit).offset(page * limit - limit)
                .then(articles => res.json({ data: articles, count, limit }))
                .catch(error => res.status(500).send(error))
        }
    }

    /* Método para retornar os artigos de um determinada categoria */
    const getByCategory = async (req, res) => {
        const categoryId = req.params.id;//Id da categoria pai
        const page = req.query.page || 1 // Variável para fazer mos a paginação, caso exista muitos artigos na categoria
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId);
        const ids = categories.rows.map(c => c.id); //Array de id´s das categorias filhas

        /* Fazendo a consulta em duas tabelas e nomeando elas com o alias 
        Basicamente como se fosse uam inner join*/
        app.db({ a: 'articles', u: 'users' })
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)
            /*Where utilizado para descobrir qual autor pertence aquele artigo, semelhante ao "on" utilizado em inner join */
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc')
            .then(articles => res.json(articles))
            .catch(error => res.status(500).send(error));// where categoryId in (ids)

    }

    return { save, remove, get, getByCategory }
}
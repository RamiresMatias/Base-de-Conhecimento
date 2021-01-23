module.exports = app => {
    const { existsOrError, notExistsError, equalsError } = app.api.validation;

    const save = (req, res) => {
        /* O destructuring do req.body é usado, pois o bodyParser intercepta a requisição e trata os dados vindos dela,
        e utilizando o operador spread pegamos desestruturamos e pegamos as propriedades importantes */
        const category = { ...req.body };

        if (req.params.id) category.id = req.params.id;

        try {
            existsOrError(category.name, "Nome não informado!");

        } catch (error) {
            return res.status(400).send(error);
        }

        if (category.id) {
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(() => res.status(200).send())
                .catch(error => res.status(500).send(error));
        } else {
            app.db('categories')
                .insert(category)
                .then(() => res.status(201).send())
                .catch(error => res.status(500).send(error));
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, "Código da Categoria não informada");

            const subCategory = await app.db('categories').where({ parentId: req.params.id });
            notExistsError(subCategory, "Categoria possui subcategoria");

            const articles = await app.db('articles').where({ categoryId: req.params.id });
            notExistsError(articles, "Categoria possui artigos");

            const rowsDelete = await app.db('categories').where({ id: req.params.id }).del();
            existsOrError(rowsDelete, "Categoria não encontrada!");

            res.status(200).send()

        } catch (error) {
            return res.status(400).send(error);
        }
    }

    const withPath = categories => {
        /* Função para retornar uma categoria pai */
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        /* Map das categorias utilizando a função para retornar a categoria pai */
        const categoriesWithPath = categories.map(categ => {
            let path = categ.name
            let parent = getParent(categories, categ.parentId)

            while (parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId);
            }

            return { ...categ, path }
        })

        /* Função para retornar as categorias ordenadas */
        categoriesWithPath.sort((a, b) => {
            if (a.path < b.path) return -1
            if (a.path > b.path) return 1
            return 0
        })
        return categoriesWithPath
    }


    const get = (req, res) => {
        let categoryId = req.params.id;
        if (categoryId) {
            app.db('categories')
                .where({ id: categoryId })
                .then(category => res.status(200).send(category))
                .catch(error => res.status(500).send(error))
        } else {
            app.db('categories')
                .then(categories => res.json(withPath(categories)))
                .catch(error => res.status(500).send(error));
        }

    }

    const toTree = (categories, tree) => {


        /* Filter para validar se a categoria possui categoria pai, se não possuir ela irá ser exibida primeiro */
        if (!tree) tree = categories.filter(c => !c.parentId);
        tree = tree.map(parentNode => {
            /* Se for verdadeiro, o nó abaixo é filho do nó no parâmetro do map. No caso isChild é filho de parentNode.
            Tudo isso de maneira recursiva */
            const isChild = node => node.parentId == parentNode.id;
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })

        return tree;
    }

    const getTree = (req, res) => {
        /* Passando as categorias para a função withPath e retornando as categorias com atributo path, e o resultado dessa função
         será passado para a função toTree para que seja convertido em árvore as categorias */

        app.db('categories')
            .then(categories => res.json(toTree(categories)))
            .catch(error => res.status(500).send(error));
    }

    return { save, get, remove, getTree }
}
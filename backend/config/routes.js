
const admin = require('./admin.js');

module.exports = app => {

    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)


    app.route('/users')
        /* Automaticamente, o consign irá carregar esses arquivos e nessa estrutura será possível
            acessar o método save no arquivo user.js na pasta api */
        .all(app.config.passport.authenticate())
        .post(admin(app.api.user.save))
        .get(admin(app.api.user.get));

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save))
        .get(admin(app.api.user.get))
        .delete(admin(app.api.user.remove))

    app.route('/categories')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.category.save))
        .get(admin(app.api.category.get))

    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree)

    app.route('/categories/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.category.get)
        .put(admin(app.api.category.save))
        .delete(admin(app.api.category.remove))

    app.route('/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.articles.get)
        .post(admin(app.api.articles.save))

    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.articles.save))
        .get(app.api.articles.get)
        .delete(admin(app.api.articles.remove))

    /* Nesta rota ele irá retornar os artigos da categoria informada nos parâmetros da requisição */
    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.articles.getByCategory)

    app.route('/stats')
        .all(app.config.passport.authenticate())
        .get(app.api.stat.get)

}
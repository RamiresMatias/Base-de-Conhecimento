module.exports = middleware => {
    /* o middleware ao qual é passado por parâmetro nesta função são as rotas definidas no arquivo routes.js
    Ou seja app.api... Caso o usuário seja admin, ele fornecerá a permissão para executar determinadas rotas*/
    return (req, res, next) => {
        if (req.user.admin) {
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não é administrador')
        }
    }
}
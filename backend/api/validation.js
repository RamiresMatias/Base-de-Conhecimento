module.exports = app => {
    /* Função para validar se existe erro */
    function existsOrError(value, msg) {
        /* Caso o valor não seja true, ele lança a exception com mensagem */
        if (!value) throw msg

        /* Caso seja um array e esteja vazio, lance a exceção */
        if (Array.isArray(value) && value.length == 0) throw msg

        /* Caso seja string e contenha espaços, lança a exceção*/
        if (typeof value === 'string' && !value.trim()) throw msg
    }

    function notExistsError(value, msg) {

        try {
            /* Se der erro na função, ele retorna no catch. Caso não tenha erro durante a execução dessa função
            ele irá retornar no throw */
            existsOrError(value, msg);
        } catch (error) {
            return
        }
        throw msg

    }

    function equalsError(valueA, valueB, msg) {
        if (valueA !== valueB) throw msg
    }

    return { existsOrError, notExistsError, equalsError }
}
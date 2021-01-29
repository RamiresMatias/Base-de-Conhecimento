import Vue from "vue"

export const baseApiUrl = `http://localhost:4000`
export const userKey = '__knowledge_user'

/* Mensagens de erro vindas do backend, onde será tratada e exibida no frontend */
export function showError(e) {
    /* Se mensagem de error for verdadeira vinda da requisição ao backend */
    if (e && e.reponse && e.response.data) {

        /* Caso a condição acima seja verdadeira, ele chama o Vue toasted para passar o objeto que contém a mensagem */
        Vue.toasted.global.defaultError({ msg: e.response.data })

        /* Caso a mensagem seja do tipo string ele apenas envia para o Vue Toasted a variável contendo a mensagem */
    } else if (typeof e === 'string') {
        Vue.toasted.global.defaultError({ msg: e })
    } else {
        Vue.toasted.global.defaultError()
    }
}

export default { baseApiUrl, showError, userKey }
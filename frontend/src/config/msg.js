import Vue from 'vue'
import Toasted from 'vue-toasted'

/* Configurando a estrutura da mensagem no Vue Toasted */
Vue.use(Toasted, {
    iconPack: 'fontawesome',
    duration: 3000
})

/* Registrando a mensagem de sucesso */
Vue.toasted.register(
    'defaultSuccess',
    payload => !payload.msg ? 'Operação realizada com sucesso!' : payload.msg,
    { type: 'success', icon: 'check' }
)

/* Registrando a mensagem de erro */
Vue.toasted.register(
    'defaultError',
    payload => !payload.msg ? 'Erro inesperado!' : payload.msg,
    { type: 'error', icon: 'times' }
)
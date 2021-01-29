import axios from "axios";
/* Métodos para validar a expiração do token */
const success = res => res
const error = err => {

    if (401 === err.response.status) {
        /* Caso esteja expirado ele retorna para a página de login */
        console.log('object')
        window.location = '/auth'
    } else {
        return Promise.reject(err)
    }
}

axios.interceptors.response.use(success, error)
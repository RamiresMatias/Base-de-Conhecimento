import Vue from 'vue'
import VueMq from 'vue-mq'
/* Configurando vue mq para media queries com vue */
Vue.use(VueMq, {
    breakpoints: {
        xs: 576,
        sm: 768,
        md: 960,
        lg: 1140,
        xl: Infinity
    }
})
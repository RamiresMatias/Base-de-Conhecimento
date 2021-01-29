<template>
  <div id="app" :class="{ 'hide-menu': !isMenuVisible || !user }">
    <Header
      title="Base de Conhecimento"
      :hideToggle="!user"
      :hideUserDropdown="!user"
    />
    <Menu v-if="user" />
    <Loading v-if="validatingToken" />
    <Content v-else />
    <Footer />
  </div>
</template>

<script>
import Loading from "./components/template/Loading.vue";
import axios from "axios";
import { baseApiUrl, userKey } from "@/config/global.js";
import { mapState } from "vuex";
import Header from "./components/template/Header.vue";
import Menu from "./components/template/Menu.vue";
import Content from "./components/template/Content.vue";
import Footer from "./components/template/Footer.vue";

export default {
  name: "App",
  components: { Header, Menu, Content, Footer, Loading },
  computed: mapState(["isMenuVisible", "user"]),
  data: function () {
    return {
      validatingToken: true,
    };
  },
  methods: {
    async validateToken() {
      this.validatingToken = true;
      const json = localStorage.getItem(userKey);
      const userData = JSON.parse(json);
      /* No processo inicial de validação, eu defino o usuário como nulo, para quando
      terminar de validar o token, eu seto novamente o usuário já com o token validado */
      this.$store.commit("setUser", null);

      /* Caso o usuário não esteja setado eu já interrompo a execução da função
      e retorno para a rota de autenticação */
      if (!userData) {
        this.validatingToken = false;
        this.$router.push({ name: "auth" });
        return;
      }
      const res = await axios.post(`${baseApiUrl}/validateToken`, userData);

      if (res.data) {
        this.$store.commit("setUser", userData);

        /* Validando o dispositivo do usuário, caso seja um devide com tamanho sm ou xs ele fecha o menu */
        if (this.$mq === "xs" || this.$mq === "sm") {
          this.$store.commit("toggleMenu", false);
        }
      } else {
        localStorage.removeItem(userKey);
        this.$router.push({ name: "auth" });
      }

      this.validatingToken = false;
    },
  },
  created() {
    this.validateToken();
  },
};
</script>

<style>
* {
  font-family: "Lato", sans-serif;
}
body {
  margin: 0;
}

#app {
  /* Propriedades para suavizar as fontes da aplicação durante a renderização */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100vh;
  display: grid;
  /* Definindo 3 linhas no template grid. A primeira 60px, 1 frame e 40 px. O primeiro será o header com 60px
  O content irá ocupar o máximo que der 1 frame. E o rodapé Footer irá ocupar 40px */
  grid-template-rows: 60px 1fr 40px;
  /* Terá duas colunas. A primeira contendo o menu da aplicação com 300px de largura e o resto irá caber no der */
  grid-template-columns: 300px 1fr;
  /*Definido as áreas e onde os componentes irão se encaixar nessas áreas */
  grid-template-areas:
    "header header" /* Na primeira linha será o header que irá ocupar de uma ponta até a outra */
    "menu content" /* A segunda linha será o Menu e Content */
    "menu footer"; /* Na terceira será o menu novamente junto com o Footer */
}

#app.hide-menu {
  grid-template-areas:
    "header header"
    "content content"
    "footer footer";
}
</style>
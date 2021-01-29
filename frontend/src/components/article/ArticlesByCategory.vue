<template>
  <div class="articles-by-category">
    <PageTitle icon="fa fa-folder-o" :main="category.name" sub="Categoria" />
    <ul>
      <li v-for="article in articles" :key="article.id">
        <ArticleItem :article="article" />
      </li>
    </ul>
    <div class="load-more">
      <button
        v-if="loadMore"
        class="btn btn-lg btn-outline-primary"
        @click="getArticles"
      >
        Carregar mais Artigos
      </button>
    </div>
  </div>
</template>

<script>
import ArticleItem from "./ArticleItem.vue";
import { baseApiUrl } from "@/config/global.js";
import axios from "axios";
import PageTitle from "../template/PageTitle.vue";
export default {
  name: "ArticleByCategory",
  components: { PageTitle, ArticleItem },
  data: function () {
    return {
      category: {},
      articles: [],
      page: 1,
      loadMore: true,
    };
  },
  methods: {
    getCategory() {
      const url = `${baseApiUrl}/categories/${this.category.id}`;
      axios.get(url).then((res) => {
        this.category = res.data[0];
      });
    },
    getArticles() {
      const url = `${baseApiUrl}/categories/${this.category.id}/articles?page=${this.page}`;
      axios.get(url).then((res) => {
        /* Concatenando para que o array receba mais artigos quando clicar em "Carregar mais", para que ele 
        não substitua */
        this.articles = this.articles.concat(res.data);
        this.page++; //Incrementando para que na próxima requisição ele possa pegar a próxima página

        /* Caso não tenha mais dados para carregar do backend o botão "Carregar mais" some*/
        if (res.data.length === 0) this.loadMore = false;
      });
    },
  },
  watch: {
    /* Adicionando um monitoramento na rota. Sempre que minha rota mudar, meu category.id recebe
    o id do artigo que foi clicado e adicionado na rota */
    $route(to) {
      this.category.id = to.params.id;
      this.articles = [];
      this.page = 1;
      this.loadMore = true;

      this.getCategory();
      this.getArticles();
    },
  },
  mounted() {
    this.category.id = this.$route.params.id;
    this.getCategory();
    this.getArticles();
  },
};
</script>

<style>
.articles-by-category ul {
  list-style: none;
  padding: 0;
}

.articles-by-category .load-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
}
</style>
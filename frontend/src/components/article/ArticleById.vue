<template>
  <div class="article-by-id">
    <PageTitle
      icon="fa fa-file-o"
      :main="article.name"
      :sub="article.description"
    />
    <div class="article-content" v-html="article.content"></div>
  </div>
</template>

<script>
import "highlightjs/styles/monokai.css";
import hljs from "highlightjs/highlight.pack.js";
import { baseApiUrl } from "@/config/global.js";
import axios from "axios";
import PageTitle from "../template/PageTitle";
export default {
  name: "ArticleById",
  components: { PageTitle },
  data: function () {
    return {
      article: {},
    };
  },
  mounted() {
    const url = `${baseApiUrl}/articles/${this.$route.params.id}`;
    axios.get(url).then((res) => (this.article = res.data));
  },
  updated() {
    /* Aplicando highlight nos artigos que possuem código, para que o tema fica do tipo monokai.
    Então ele navega em cada tag pre onde está renderizando os artigos com código e inseri o highlight */
    document.querySelectorAll(".article-content pre").forEach((e) => {
      hljs.highlightBlock(e);
    });
  },
};
</script>

<style>
.article-by-id {
  background-color: #fff;
  border-radius: 8px;
  padding: 25px;
}

.article-content pre {
  padding: 20px;
  border-radius: 8px;
  font-size: 1.2rem;
  background-color: #1e1e1e;
  color: #fff;
}

.article-content img {
  max-width: 100%;
}

.artcile :last-child {
  margin-bottom: 0px;
}
</style>
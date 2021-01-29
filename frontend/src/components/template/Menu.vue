<template>
  <aside class="menu" v-show="isMenuVisible">
    <div class="menu-filter">
      <i class="fa fa-search fa-lg"></i>
      <input
        type="text"
        placeholder="Digite para filtrar"
        v-model="treeFilter"
        class="filter-field"
      />
    </div>
    <Tree
      :data="treeData"
      :options="treeOptions"
      :filter="treeFilter"
      ref="tree"
    />
  </aside>
</template>

<script>
/* Função do vuex que mapeia um atributo da store dentro do componente menu */
import { mapState } from "vuex";
import Tree from "liquor-tree";
import { baseApiUrl } from "@/config/global.js";
import axios from "axios";
export default {
  name: "Menu",
  data: function () {
    return {
      treeFilter: "",
      /* Atributo que será utilizado para ppreencher os dados da árvore */
      treeData: this.getTreeData(),
      /* Definindo as opções da árvore para que substitua o atributo text pelo name
      para que o liquor tree consiga carregar os dados */
      treeOptions: {
        propertyNames: { text: "name" },
        filter: {
          emptyText: "Categoria não encontrada",
        },
      },
    };
  },
  components: { Tree },
  /* Dentro do array é possível mapear todos os atributos na store */
  computed: mapState(["isMenuVisible"]),
  methods: {
    getTreeData() {
      const url = `${baseApiUrl}/categories/tree`;

      /* O Liquor tree consegue percebe que está sendo feita uma requisição com uma promise, e após ela ser resolvida
      irá colocar os dados na árvore */
      return axios.get(url).then((res) => res.data);
    },
    onNodeSelect(node) {
      /* Forma de fazer uma navegação programática com router */
      this.$router.push({
        /* Quando a função por chama o router chama a rota configurada com esse nome.
        no caso a rota "/articles/:id" colocando o id passado pelo parâmetro da função */
        name: "articlesByCategory",
        params: { id: node.id },
      });
      if (this.$mq === "xs" || this.$mq === "sm") {
        this.$store.commit("toggleMenu", false);
      }
    },
  },
  mounted() {
    /* $refs uma maneira de acessar algum elemento dentro do template.
    Para cada elemento da árvore será vinculado o evento on.
    E toda vez que clicar será chamado a função onNodeSelect, passando o
    elemento por parâmetro e acessando a rota no evento */
    this.$refs.tree.$on("node:selected", this.onNodeSelect);
  },
};
</script>

<style>
.menu {
  grid-area: menu;
  background: linear-gradient(to right, #232526, #414345);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.menu a,
.menu a:hover {
  color: #fff;
  text-decoration: none;
}
.menu .tree-node.selected > .tree-content,
.menu .tree-node .tree-content:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.tree-arrow.has-child {
  filter: brightness(2);
}

.menu .menu-filter {
  display: flex;
  justify-content: center;
  align-self: center;

  margin: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #aaa;
}

.menu .menu-filter i {
  color: #aaa;
  margin-top: 8px;
  margin-right: 10px;
}
.menu input {
  color: #ccc;
  font-size: 1.3rem;
  border: 0;
  outline: 0;
  width: 100%;
  background: transparent;
}
.tree-filter-empty {
  color: #ccc;
  margin-left: 20px;
  font-size: 1.3rem;
}
</style>
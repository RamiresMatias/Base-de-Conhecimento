<template>
  <div class="category-admin">
    <b-form>
      <input id="category-id" type="hidden" v-model="category.id" />
      <b-row>
        <b-col md="12" sm="12">
          <b-form-group label="Categorias:" label-for="category-name">
            <b-form-input
              id="category-name"
              type="text"
              v-model="category.name"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Nome da Categoria"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="12" sm="12">
          <b-form-group label="Categoria Pai:" label-for="category-parentId">
            <b-form-select
              v-if="mode === 'save'"
              id="category-parentId"
              :options="categories"
              v-model="category.parentId"
            />
            <b-form-input
              v-else
              id="category-parentId"
              type="text"
              v-model="category.path"
              readonly
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="primary" v-if="mode === 'save'" @click="save"
            >Salvar</b-button
          >
          <b-button variant="danger" v-if="mode === 'remove'" @click="remove"
            >Excluir</b-button
          >
          <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr />
    <b-table
      hover
      striped
      :items="categories"
      :current-page="page"
      :per-page="limit"
      :fields="fields"
      id="my-table"
    >
      <template slot="actions" slot-scope="data">
        <b-button
          variant="warning"
          @click="loadCategory(data.item)"
          class="mr-2"
          ><i class="fa fa-pencil"></i
        ></b-button>
        <b-button
          variant="danger"
          @click="loadCategory(data.item, 'remove')"
          class="mr-2"
          ><i class="fa fa-trash"></i
        ></b-button>
      </template>
    </b-table>
    <b-pagination
      size="md"
      v-model="page"
      :total-rows="rows"
      :per-page="limit"
      id="my-table"
    ></b-pagination>
  </div>
</template>

<script>
import axios from "axios";
import { baseApiUrl, showError } from "@/config/global.js";
export default {
  name: "CategoryAdmin",
  data: function () {
    return {
      mode: "save",
      category: {},
      categories: [],
      page: 1,
      limit: 10,
      fields: [
        { key: "id", label: "Código", sortable: true },
        { key: "name", label: "Nome", sortable: true },
        { key: "path", label: "Caminho", sortable: true },
        { key: "actions", label: "Ações" },
      ],
    };
  },
  computed: {
    rows() {
      return this.categories.length;
    },
  },

  methods: {
    getCategories() {
      const url = `${baseApiUrl}/categories`;
      axios
        .get(url)
        .then((res) => {
          this.categories = res.data.map((category) => {
            return { ...category, value: category.id, text: category.path };
          });
        })
        .catch(showError);
    },
    save() {
      const method = this.category.id ? "put" : "post";
      const idCategory = this.category.id ? `/${this.category.id}` : "";

      const { id, name, parentId } = this.category;

      this.category = {
        id,
        name,
        parentId,
      };
      /* Setando o nome do método dentro da variável method*/
      axios[method](`${baseApiUrl}/categories${idCategory}`, this.category)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.category.id;

      axios
        .delete(`${baseApiUrl}/categories/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    reset() {
      this.mode = "save";
      this.category = {};

      this.getCategories();
    },
    loadCategory(category, mode = "save") {
      this.mode = mode;
      this.category = { ...category };
    },
  },
  mounted() {
    this.getCategories();
  },
};
</script>

<style>
</style>
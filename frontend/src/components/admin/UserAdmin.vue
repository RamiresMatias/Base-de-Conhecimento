<template>
  <div class="user-admin">
    <b-form>
      <input id="user-id" type="hidden" v-model="user.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Nome:" label-for="user-name">
            <b-form-input
              id="user-name"
              type="text"
              v-model="user.name"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Nome do Usuário"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="E-mail:" label-for="user-email">
            <b-form-input
              id="user-email"
              :readonly="mode === 'remove'"
              type="text"
              v-model="user.email"
              required
              placeholder="Informe o E-mail do Usuário"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-checkbox id="user-admin" v-model="user.admin" class="mt-3 mb-3"
        >Administrador?</b-form-checkbox
      >
      <b-row v-show="mode === 'save'">
        <b-col md="6" sm="12">
          <b-form-group label="Senha:" label-for="user-password">
            <b-form-input
              id="user-password"
              type="password"
              v-model="user.password"
              required
              placeholder="Informe a Senha do Usuário"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group
            label="Confirme a Senha:"
            label-for="user-passwordConfirm"
          >
            <b-form-input
              id="user-passwordConfirm"
              type="password"
              v-model="user.passwordConfirm"
              required
              placeholder="Confirme a Senha do Usuário"
            ></b-form-input>
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
      :items="users"
      :current-page="page"
      :per-page="limit"
      :fields="fields"
    >
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadUser(data.item)" class="mr-2"
          ><i class="fa fa-pencil"></i
        ></b-button>
        <b-button
          variant="danger"
          @click="loadUser(data.item, 'remove')"
          class="mr-2"
          ><i class="fa fa-trash"></i
        ></b-button>
      </template>
    </b-table>
    <b-row class="pagination-excel">
      <b-pagination
        size="md"
        v-model="page"
        :total-rows="rows"
        :per-page="limit"
        id="my-table"
      ></b-pagination>
      <VueExcel
        :data="users"
        :fields="usersJson"
        type="xls"
        class="btn btn-primary vue-excel"
        >Exportar Dados(xls)</VueExcel
      >
    </b-row>
  </div>
</template>

<script>
import VueExcel from "vue-json-excel";
import axios from "axios";
import { baseApiUrl, showError } from "@/config/global.js";
export default {
  name: "UserAdmin",
  components: { VueExcel },
  data: function () {
    return {
      mode: "save",
      user: {},
      users: [],
      limit: 10,
      page: 1,
      fields: [
        { key: "id", label: "Código", sortable: true },
        { key: "name", label: "Nome", sortable: true },
        { key: "email", label: "E-mail", sortable: true },
        {
          key: "admin",
          label: "Administrador",
          sortable: true,
          formatter: (value) => (value ? "Sim" : "Não"),
        },
        { key: "actions", label: "Ações" },
      ],
      usersJson: {
        Código: "id",
        Nome: "name",
        "E-mail": "email",
        Administrador: {
          //No caso admin
          field: "admin",
          // Aplique está formatação, se for true retorne 'sim'
          callback: (value) => {
            return value === true ? "Sim" : "Não";
          },
        },
      },
    };
  },
  computed: {
    rows() {
      /* Quantidade de users para retornar limite total de linhas na tabela
      para paginação */
      return this.users.length;
    },
  },
  methods: {
    loadUsers() {
      const url = `${baseApiUrl}/users`;
      axios.get(url).then((res) => {
        this.users = res.data;
      });
    },
    reset() {
      this.mode = "save";
      this.user = {};
      this.loadUsers();
    },
    save() {
      const method = this.user.id ? "put" : "post";
      const id = this.user.id ? `/${this.user.id}` : "";

      /* Setando o nome do método dentro da variável method */
      axios[method](`${baseApiUrl}/users${id}`, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
      /* Caso retorne algum erro. Ele chama o método criado em msg.js para o toasted mostrar */
    },
    remove() {
      const id = this.user.id;

      axios
        .delete(`${baseApiUrl}/users/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadUser(user, mode = "save") {
      this.mode = mode;
      this.user = { ...user };
    },
  },
  mounted() {
    this.loadUsers();
  },
};
</script>

<style>
.vue-excel {
  height: 50px;
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-excel {
  display: flex;
  justify-content: space-between;
  padding-right: 15px;
}
</style>
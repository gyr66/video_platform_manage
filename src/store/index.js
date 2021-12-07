import Vue from "vue";
import Vuex from "vuex"

import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    login(state, user) {
      state.user = user;
    },
    logout(state) {
      state.user = null
    }

  },
  actions: {},
  getters: {},
  modules: {},
  plugins: [createPersistedState()]
});

export default store
import { createStore } from 'vuex';

const store = createStore({
  state: {
    clientId: null,
    notification: null,
    message: null
  },
  mutations: {
    setClientId(state, id) {
      state.clientId = id;
    },
    clearClientId(state) {
      state.clientId = null;
    },
    setNotification(state, notification) {
      state.notification = notification;
    },
    setMessage(state, message) {
      state.message = message;
    },
    clearNotification(state) {
      state.notification = null;
    },
    clearMessage(state) {
      state.message = null;
    }
  },
  actions: {
    updateClientId({ commit }, id) {
      commit('setClientId', id);
      setTimeout(() => {
        commit('clearClientId');
      }, 72 * 60 * 60 * 1000); // 72 horas en milisegundos
    },
    logout({ commit }) {
      commit('clearClientId');
      localStorage.removeItem('Authorization');
    },
    setNotification({ commit }, notification) {
      commit('setNotification', notification);
      setTimeout(() => {
        commit('clearNotification');
      }, 5000); // 5 segundos en milisegundos
    },
    setMessage({ commit }, message) {
      commit('setMessage', message);
      setTimeout(() => {
        commit('clearMessage');
      }, 5000); // 5 segundos en milisegundos
    },
    clearNotification({ commit }) {
      commit('clearNotification');
    },
    clearMessage({ commit }) {
      commit('clearMessage');
    }
  },
  getters: {
    getClientId(state) {
      return state.clientId;
    },
    getNotification(state) {
      return state.notification;
    },
    getMessage(state) {
      return state.message;
    }
  }
});

export default store;

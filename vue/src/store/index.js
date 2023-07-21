import { createStore } from 'vuex';

const store = createStore({
  state: {
    clientId: null,
    notification: null,
    message: null,
    selectedDate: null,
    selectedTime: null
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
    },
    setSelectedDate(state, date) {
      state.selectedDate = date;
    },
    setSelectedTime(state, time) {
      state.selectedTime = time;
    },
    clearSelectedDateTime(state) {
      state.selectedDate = null;
      state.selectedTime = null;
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
    },
    updateSelectedDateTime({ commit }, { date, time }) {
      commit('setSelectedDate', date);
      commit('setSelectedTime', time);
    },
    clearSelectedDateTime({ commit }) {
      commit('clearSelectedDateTime');
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
    },
    getSelectedDate(state) {
      return state.selectedDate;
    },
    getSelectedTime(state) {
      return state.selectedTime;
    }
  }
});

export default store;
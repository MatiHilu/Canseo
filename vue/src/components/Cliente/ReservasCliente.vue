<template>
  <NavCliente />
  <div class="general">
    <h1>Mis reservas</h1>
    <div v-if="notification" class="notification" :class="notificationClass">
      {{ message }}
    </div>
    <div v-for="reserva in reservas" :key="reserva.id" class="reserva-item">
      <div class="img-reserva">
        <p>Fecha: {{ formatDate(reserva.fecha) }}</p>
        <img class="img-perfil" :src="getImageUrl(reserva.foto_perfil || '/uploads/default-profile.png')"
          :alt="reserva.nombre + ' ' + reserva.apellido">
      </div>
      <p>Comienzo rango horario: {{ reserva.hora }}</p>
      <p>Paseador: {{ reserva.nombre }} {{ reserva.apellido }}</p>
      <p>Estado: {{ reserva.estado }}</p>

    </div>

  </div>
</template>

<script>
  import ReservasService from "@/services/ReservasService";
  import store from "@/store/index";
  import moment from "moment";
  import NavCliente from "@/components/Nav/NavCliente.vue";

  export default {
    name: "ReservasCliente",
    components: {
      NavCliente,
    },
    data() {
      return {
        reservas: [],
        paseadores: [],
        notification: null,
      };
    },
    mounted() {
      this.fetchReservas();
      this.fetchNotification();
    },
    methods: {
      fetchReservas() {
        const id_cliente = store.getters.getClientId;
        ReservasService.getReservasByUserId(id_cliente)
          .then((response) => {
            this.reservas = response.data.reverse();
            console.log(this.reservas)
          })
          .catch((error) => {
            console.log(error);
          });
      },
      formatDate(date) {
        return moment(date).format("DD/MM/YYYY");
      },
      fetchNotification() {
      this.notification = store.state.notification;
      this.message = store.state.message;
      // Limpiar la notificación después de mostrarla
      setTimeout(() => {
      this.notification = null;
      this.message = null;
      store.commit('setNotification', null);
      store.commit('setMessage', null);
    }, 8000); // 5 segundos en milisegundos
    },
      getImageUrl(filename) {
        if (filename) {
          const imagePath = filename.replace('vue', '').replace('public', '');
          const baseUrl = window.location.origin;
          return `${baseUrl}/${imagePath}`;
        }
      },
    },
    computed: {
    notificationClass() {
      // Agrega las clases CSS según el tipo de notificación
      return {
        'notification-success': this.notification === 'success',
        'notification-error': this.notification === 'error',
      };
    },
  },
  };
</script>

<style scoped>
  .general {
    min-height: 60vh;
    margin: 0 auto;
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 40px;
  }

  h1 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 15px;
  }

  .img-perfil {
    width: 85px;
    border-radius: 100px;
  }


  .reserva-item {
    width: 100%;
    margin-bottom: 10px;
    background-color: #fff;
    border-radius: 5px;
    border: 3px solid #8DBD47;
    padding: 10px;
  }

  .img-reserva {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: -45px;
  }

  .notification {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.notification-success {
  background-color: #dff0d8;
  color: #3c763d;
}

.notification-error {
  background-color: #f2dede;
  color: #a94442;
}
</style>

<template>
  <NavCliente />
  <div class="general">
    <h1>Paseadores disponibles</h1>
    <!-- Agregar la notificación aquí -->
    <div v-if="notification" class="notification" :class="notificationClass">
      {{ message }}
    </div>
    <p>Fecha seleccionada: {{ date }}</p>
    <p>Rango horario seleccionado: {{ time }}</p>
    <div class="paseadores-grid">

      <div class="paseador-item" v-for="paseador in paseadores" :key="paseador.id+paseador.nombre">
        <img :src="getImageUrl(paseador.foto_perfil || '/uploads/default-profile.png')"
          :alt="paseador.nombre + ' ' + paseador.apellido">
        <router-link :to="'/paseador/' + paseador.id">
          <p>{{ paseador.nombre }} {{ paseador.apellido }}</p>
        </router-link>
        <router-link :to="'/paseador/' + paseador.id">
          <button class="ver-datos">Ver datos</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import PaseadoresService from "@/services/PaseadoresService";
  import store from "@/store/index";
  import moment from 'moment';
  import NavCliente from "@/components/Nav/NavCliente.vue";

  export default {
    name: "PaseadoresList",
    components: {
      NavCliente,
    },
    data() {
      return {
        paseadores: [],
        notification: null,
        message: "",
        date: null,
        time: null
      };
    },
    mounted() {
      this.fetchPaseadores();
      this.fetchNotification();
    },
    methods: {
      fetchPaseadores() {
        const clientId = store.getters.getClientId;
        const selectedTime = store.getters.getSelectedTime;
        const selectedDate = new Date(store.getters.getSelectedDate);
        const dayOfWeek = selectedDate.getDay();
        const daysOfWeekNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const diaSemana = daysOfWeekNames[dayOfWeek];

        // Enviar los datos de fecha y hora en la URL de la solicitud GET
        const fecha = moment(store.getters.getSelectedDate).format(
        'YYYY-MM-DD'); // Convertir fecha a formato ISO (YYYY-MM-DD)

        const horaInicial = selectedTime.split(' - ')[0];
        // Salida: '7:00'

        // Agregar los datos de fecha y hora a la URL de la solicitud GET
        PaseadoresService.getByBarrio(clientId, {
            dia_semana: diaSemana,
            fecha: fecha,
            hora: horaInicial
          })
          .then((response) => {
            this.paseadores = response.data;
            this.date = moment(store.getters.getSelectedDate).format('DD/MM/YYYY');
            this.time = store.getters.getSelectedTime;
          })
          .catch((error) => {
            console.log(error);
          });
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
        }, 5000); // 5 segundos en milisegundos
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
    padding-bottom: 40px;
  }

  h1 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 15px;
  }

  .paseadores-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .paseadores-grid img {
    width: 60px;
    border-radius: 100px;
  }

  .paseador-item {
    width: calc(50% - 10px);
    margin-bottom: 10px;
    background-color: #fff;
    border-radius: 5px;
    border: 3px solid #8DBD47;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }

  .paseador-item p {
    margin-top: 10px;
    color: #000;
    font-weight: 600;
  }

  .ver-datos {
    border-radius: 5px;
    border: 1px solid #8DBD47;
    background-color: #8DBD47;
    font-size: 14px;
    padding: 3px 15px;
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

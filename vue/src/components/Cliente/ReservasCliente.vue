<template>
  <NavCliente />
  <div class="general">
    <h1>Mis reservas</h1>
    <div v-if="notification" class="notification" :class="notificationClass">
      {{ message }}
    </div>
    <div class="filter-section">
      <form @submit.prevent="fetchReservasFiltradas">
        <div class="form-row">
          <label class="fecha" for="fecha">Fecha:</label>
          <input type="date" v-model="fecha" id="fecha">
        </div>

        <div class="form-row">
          <label class="hora" for="hora">Hora:</label>
          <select v-model="hora" id="hora">
            <option value="">Todos</option>
            <option value="7:00">7:00 - 13:00</option>
            <option value="13:00">13:00 - 17:00</option>
            <option value="18:00">18:00 - 22:00</option>
          </select>
        </div>

        <div class="form-row">
          <label class="estado" for="estado">Estado:</label>
          <select v-model="estado" id="estado">
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Terminado">Terminado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <div class="form-row row-buttons">
          <button type="submit">Filtrar</button>
          <button @click="clearFilters">Borrar Filtros</button>
        </div>
      </form>
    </div>
    <div v-for="reserva in reservas" :key="reserva.id" class="reserva-item">
      <div class="img-reserva">
        <p>Fecha: {{ formatDate(reserva.fecha) }}</p>
        <img class="img-perfil" :src="getImageUrl(reserva.foto_perfil || '/uploads/default-profile.png')"
          :alt="reserva.nombre + ' ' + reserva.apellido">
      </div>
      <p>Comienzo rango horario: {{ reserva.hora }}</p>
      <p>Paseador: {{ reserva.nombre }} {{ reserva.apellido }}</p>
      <div class="div-cancelar">
        <p>Estado: {{ reserva.estado }}</p>
        <button v-if="reserva.estado === 'Pendiente' && cancelar(reserva)" @click="cambiarEstado(reserva.id, 'Cancelado')">Cancelar</button>
        <span v-else></span>
      </div>
      

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
        fecha: '',
        hora: '',
        estado: '',
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
          })
          .catch((error) => {
            console.log(error);
          });
      },
      fetchReservasFiltradas() {
        const id_cliente = store.getters.getClientId;
        ReservasService.getReservasFiltradas(id_cliente, {
          fecha: this.fecha,
          hora: this.hora,
          estado: this.estado,
        })
          .then((response) => {
            this.reservas = response.data.reverse();
          })
          .catch((error) => {
            console.log(error);
          });
      },
      clearFilters() {
      this.fecha = '';
      this.hora = '';
      this.estado = '';
      this.fetchReservas();
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
    cambiarEstado(reservaId, nuevoEstado) {
      ReservasService.updateEstado(reservaId, nuevoEstado)
        .then((response) => {
          this.fetchReservas(); // Volver a cargar las reservas actualizadas
          console.log(response)
        })
        .catch((error) => {
          console.log("Error al actualizar el estado de reserva:", error);
        });
    },
    cancelar(reserva) {
        const reservaDateTime = moment(`${reserva.fecha} ${reserva.hora}`, "YYYY-MM-DD HH:mm");
        const now = moment();
        const twentyFourHoursFromNow = now.clone().add(24, 'hours');
        return reservaDateTime.isAfter(twentyFourHoursFromNow);
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

.div-cancelar{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.div-cancelar button{
  border: 1px solid #fff;
  background: #fff;
  color: rgb(236, 40, 40);
}

  @media (min-width: 860px){
    .filter-section {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    padding: 10px;
  }

  .filter-section form{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .form-row{
    margin-right: 15px;
      margin-left: 0;
  }

  .form-row button {
    margin-right: 5px;
    cursor: pointer;
    padding: 4px 15px;
    border: none;
    border-radius: 5px;
    color: #fff;
    background-color: #8dbd47;
  }

  label{
    margin-right: 5px;
    margin-bottom: 0;
  }

  }

  @media (max-width: 859px) {
    .filter-section {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    padding: 10px;
  }


  input, select{
    width: 200px;
    padding: 0px 8px;
  }

  .filter-section form{
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  label{
    margin-right: 15px;
  }
  .form-row{
    margin-top: 10px;
  }
  .form-row button {
    margin-right: 5px;
    cursor: pointer;
    padding: 4px 15px;
    border: none;
    border-radius: 5px;
    color: #fff;
    background-color: #8dbd47;
  }

  .fecha{
    margin-right: 17px;
  }

  .hora{
    margin-right: 24px;
  }

  .estado{
    margin-right: 10px;
  }
  }
</style>

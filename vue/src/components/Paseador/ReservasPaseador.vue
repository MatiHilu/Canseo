<template>
  <NavPaseador/>
  <div class="general">
    <h1>Paseos reservados</h1>
    <div v-for="reserva in reservas" :key="reserva.id" class="reserva-item">
      <div class="img-reserva">
        <p>Fecha: {{ formatDate(reserva.fecha) }}</p>
        <img class="img-perfil" :src="getImageUrl(reserva.foto_perfil || '/uploads/default-profile.png')" :alt="reserva.Nombre + ' ' + reserva.Apellido">
      </div>
      <p>Hora: {{ reserva.hora }}</p>
      <p>Cliente: {{ reserva.Nombre }} {{ reserva.Apellido }}</p>
      <p>Dirección: {{ reserva.Direccion }}</p>
      <p>Perro: {{ reserva.Nombre_Perro }} Raza: {{ reserva.Nombre_Raza }}</p>
      <p>Estado: {{ reserva.estado }}</p>
      <button v-if="reserva.estado === 'Pendiente'" @click="cambiarEstado(reserva.id, 'Terminado')" :disabled="!canMarkAsCompleted(reserva)">Paseo terminado</button>
      <span v-if="reserva.estado === 'Terminado'"></span>
    </div>
  </div>
</template>

<script>
import ReservasService from "@/services/ReservasService";
import store from "@/store";
import moment from "moment";
import NavPaseador from "@/components/Nav/NavPaseador.vue";

export default {
  name: "ReservasPaseador",
  components: {
    NavPaseador,
  },
  data() {
    return {
      reservas: [],
    };
  },
  mounted() {
    this.fetchReservas();
  },
  methods: {
    fetchReservas() {
      const idPaseador = store.getters.getClientId;
      
      ReservasService.getReservasByPaseadorId(idPaseador)
        .then((response) => {
          this.reservas = response.data.reverse();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cambiarEstado(reservaId, nuevoEstado) {
      ReservasService.updateEstado(reservaId, nuevoEstado)
        .then((response) => {
          console.log("Estado de reserva actualizado:", response.data);
          this.fetchReservas(); // Volver a cargar las reservas actualizadas
        })
        .catch((error) => {
          console.log("Error al actualizar el estado de reserva:", error);
        });
    },
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    canMarkAsCompleted(reserva) {
      const reservaDateTime = moment(`${reserva.fecha} ${reserva.hora}`, "YYYY-MM-DD HH:mm");
      const now = moment();
      const oneHourAfterReserva = reservaDateTime.clone().add(4, 'hour');
      return now.isAfter(oneHourAfterReserva);
    },
    getImageUrl(filename) {
      if (filename) {
        const imagePath = filename.replace('vue', '').replace('public', '');
        const baseUrl = window.location.origin;
        return `${baseUrl}/${imagePath}`;
      }
    },
  },
};
</script>

<style scoped>
.general{
  min-height: 60vh; /*Hace que el footer quede pegado abajo incluso cuando no haya suficiente contenido*/ 
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

.img-perfil{
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

.img-reserva{
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: -45px;
}

button{
  border-radius: 5px;
  border: 1px solid #8DBD47;
  background-color: #8DBD47;
  font-size: 14px;
  padding: 3px 15px;
}
</style>

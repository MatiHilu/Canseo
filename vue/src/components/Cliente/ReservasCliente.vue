<template>
  <NavCliente/>
  <div class="general">
    <h1>Mis reservas</h1>
    
      <div v-for="reserva in reservas" :key="reserva.id" class="reserva-item">
        <div class="img-reserva"> 
          <p>Fecha: {{ formatDate(reserva.fecha) }}</p>
          <img class="img-perfil" :src="getImageUrl(reserva.foto_perfil || '/uploads/default-profile.png')" :alt="reserva.nombre + ' ' + reserva.apellido">
        </div>
        <p>Hora: {{ reserva.hora }}</p>
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
    };
  },
  mounted() {
    this.fetchReservas();
    //this.fetchPaseadores();
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
</style>

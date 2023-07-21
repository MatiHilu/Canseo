<template>
  <NavCliente/>
  <div class="general">
    <h1>Detalles de paseador</h1>
    <div class="contenedor" v-if="paseador">
      <img class="img-perfil" :src="getImageUrl(paseador.foto_perfil || '/uploads/default-profile.png')" :alt="paseador.nombre + ' ' + paseador.apellido">
      <p>{{ paseador.nombre }} {{ paseador.apellido }}</p>
      <p><strong>Descripción:</strong> {{ paseador.descripcion }}</p>
      <button class="reservar-paseador" @click="reservarPaseador">Reservar</button>
    </div>
    <div v-else>
      <p>Cargando datos del paseador...</p>
    </div>
  </div>
</template>

<script>
import PaseadoresService from "@/services/PaseadoresService";
import ReservasService from "@/services/ReservasService";
import NavCliente from "@/components/Nav/NavCliente.vue";
import store from "@/store/index";
import moment from 'moment';

export default {
  name: "PaseadorIndividual",
  components: {
    NavCliente,
  },
  data() {
    return {
      paseador: null
    };
  },
  mounted() {
    this.fetchPaseador();
  },
  methods: {
    fetchPaseador() {
      const paseadorId = this.$route.params.id;
      PaseadoresService.get(paseadorId)
        .then((response) => {
          this.paseador = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    reservarPaseador() {

      const nuevaReserva = {
        id_paseador: this.$route.params.id,
        id_cliente: store.getters.getClientId,
        fecha: moment(store.getters.getSelectedDate).format('YYYY/MM/DD'),
        hora: store.getters.getSelectedTime,
      };

      ReservasService.create(nuevaReserva)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/reservas-cliente");
          store.commit('setNotification', 'success');
          store.commit('setMessage', 'Paseo reservado!');
        })
        .catch((error) => {
          console.log("Error al crear la reserva: ", error);
          this.error = "Error al crear la reserva." + error;
        });

    },
    getImageUrl(filename) {
      if (filename) {
        const imagePath = filename.replace('vue', '').replace('public', '');
        const baseUrl = window.location.origin;
        return `${baseUrl}/${imagePath}`;
      }
    },
  }
};
</script>

<style scoped>
.general{
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

.img-perfil{
  width: 150px;
  border-radius: 100px;
  margin-bottom: 20px;
}

.reservar-paseador{
  border-radius: 5px;
  border: 1px solid #8DBD47;
  background-color: #8DBD47;
  font-size: 14px;
  padding: 3px 15px;
  width: 100%;
  height: 40px;
  margin-top: 45px;
  margin-bottom: 45px;
  font-size: 16px;
  font-weight: 600;
}

.contenedor{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80vw;
}

</style>

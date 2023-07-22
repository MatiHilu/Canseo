<template>
  <NavPaseador/>
  <div class="general">
    <div v-if="notification" class="notification" :class="notificationClass">
      {{ message }}
    </div>
    <h1>Mi perfil</h1>
    <div>
      <div class="img-usuario">
      <p>Nombre: {{ paseador.nombre }} {{ paseador.apellido }}</p>
      <img class="img-perfil" :src="getImageUrl(paseador.foto_perfil || '/uploads/default-profile.png')" alt="Foto de perfil">
    </div>
      <p>Email: {{ paseador.email }}</p>
      <p>Teléfono: {{ paseador.telefono }}</p>
      <p>Dirección: {{ paseador.direccion }}, {{ paseador.nombre_barrio }}</p>
      <p>Descripción: {{ paseador.descripcion }}</p>    
      <p>Días de trabajo: <span v-if="paseador.dias_disponibles == 0">No seleccionado<br/>(Para poder aparecer en las busquedas tenés que tener al menos 1 día disponible para trabajar)</span>
  <span v-else v-for="(dia, index) in paseador.dias_disponibles" :key="index">
    {{ dia === 'domingo' ? 'Domingo' : (dia === 'lunes' ? 'Lunes' : (dia === 'martes' ? 'Martes' : (dia === 'miercoles' ? 'Miércoles' : (dia === 'jueves' ? 'Jueves' : (dia === 'viernes' ? 'Viernes' : (dia === 'sabado' ? 'Sábado' : dia)))))) }}
    <span v-if="index !== paseador.dias_disponibles.length - 1">| </span>
  </span>
</p>
   
    </div>
  
    <router-link  :to="'/editar-paseador/'">
      <button>Editar perfil</button>
    </router-link>
    <router-link class="cambiar-contrasena"  :to="'/cambiar-contrasena/paseador'">
        <button>Cambiar contraseña</button>
    </router-link>
  </div>
</template>


<script>
import PaseadoresService from "@/services/PaseadoresService";
import store from "@/store";
import NavPaseador from "@/components/Nav/NavPaseador.vue";

export default {
  name: "PerfilPaseador",
  components: {
    NavPaseador,
  },
  data() {
    return {
      paseador: {},     
    };
  },
  mounted() {
    const paseadorId = store.getters.getClientId;
    this.fetchPaseador(paseadorId);
  },
  computed: {
    notification() {
      return store.getters.getNotification;
    },
    message() {
      return store.getters.getMessage;
    },
    notificationClass() {
      return {
        error: this.notification === "error",
        success: this.notification === "success"
      };
    }
  },
  methods: {
    fetchPaseador(paseadorId) {
      PaseadoresService.get(paseadorId)
        .then((response) => {
          this.paseador = response.data;
        })
        .catch((error) => {
          console.log("Error al obtener el perfil del paseador: ", error);
        });
    },
    getImageUrl(filename) {
  if (filename) {
    
    const imagePath = filename.replace('vue', '').replace('public', '');
    const baseUrl = window.location.origin;
    
    return `${baseUrl}/${imagePath}`;
  }
}


  },
};
</script>

<style scoped>
.general{
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
  
  .form-group {
    margin-bottom: 10px;
  }
  
  label {
    display: block;
    font-weight: bold;
  }
  
  input,
  textarea,
  select {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  
  button {
  border-radius: 5px;
  border: 1px solid #8DBD47;
  background-color: #8DBD47;
  font-size: 16px;
  padding: 4px 8px;
  cursor: pointer;
  align-self: center;
  margin-bottom: 20px;
  margin-top: 20px;
}

  .img-usuario{
  display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: -45px;
}

.img-perfil{
  width: 120px;
  border-radius: 100px;
}

.notification {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;

}

.error {
  background-color: #f2dede;
  color: #a94442;
}

.success {
  background-color: #dff0d8;
  color: #3c763d;
}

.cambiar-contrasena{
  margin-left: 15px;
}
</style>

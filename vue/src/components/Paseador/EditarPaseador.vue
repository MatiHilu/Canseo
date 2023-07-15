<template>
    <NavPaseador/>
    <div class="general">
    <div v-if="notification" class="notification" :class="notificationClass">
      {{ message }}
    </div>
    <h1>Editar perfil</h1>
    <form @submit.prevent="updateProfile" enctype="multipart/form-data">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="updatedPaseadorData.nombre" required>
      </div>
      <div class="form-group">
        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" v-model="updatedPaseadorData.apellido" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="updatedPaseadorData.email" required>
      </div>
      <div class="form-group">
        <label for="telefono">Teléfono:</label>
        <input type="text" id="telefono" v-model="updatedPaseadorData.telefono" required>
      </div>
      <div class="form-group">
        <label for="direccion">Dirección:</label>
        <input type="text" id="direccion" v-model="updatedPaseadorData.direccion" required>
      </div>
      <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea id="descripcion" v-model="updatedPaseadorData.descripcion"></textarea>
      </div>
      <div class="form-group">
        <label for="barrio">Barrio:</label>
        <select id="barrio" v-model="updatedPaseadorData.id_barrio" required>
          <option v-for="barrio in barrios" :value="barrio.id" :key="barrio.id">{{ barrio.nombre }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="foto_perfil">Foto de perfil:</label>
        <input type="file" id="foto_perfil" @change="handleFileUpload">
      </div>
      <div class="caja-flex">
        <button type="submit">Guardar cambios</button>
      </div>
      <span><router-link to="/perfil/paseador" class="nav-link">Cancelar</router-link></span>
    </form>
</div>
</template>

<script>
import PaseadoresService from "@/services/PaseadoresService";
import BarriosService from "@/services/BarriosService";
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
      updatedPaseadorData: {},
      barrios: [],      
      file: null,
    };
  },
  mounted() {
    const paseadorId = store.getters.getClientId;
    this.fetchPaseador(paseadorId);
    this.fetchBarrios();
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
    handleFileUpload(event) {
      this.updatedPaseadorData.foto_perfil = event.target.files[0];
    },
    fetchPaseador(paseadorId) {
      PaseadoresService.get(paseadorId)
        .then((response) => {
          this.paseador = response.data;
          this.updatedPaseadorData = { ...this.paseador };
        })
        .catch((error) => {
          console.log("Error al obtener el perfil del paseador: ", error);
        });
    },
    fetchBarrios() {
      BarriosService.getAll()
        .then((response) => {
          this.barrios = response.data;
        })
        .catch((error) => {
          console.log("Error al obtener la lista de barrios: ", error);
        });
    },
    updateProfile() {
      const paseadorId = store.getters.getClientId;
      const EditarPaseador = new FormData();
      EditarPaseador.append('nombre', this.updatedPaseadorData.nombre);
      EditarPaseador.append('apellido', this.updatedPaseadorData.apellido);
      EditarPaseador.append('email', this.updatedPaseadorData.email);
      EditarPaseador.append('telefono', this.updatedPaseadorData.telefono);
      EditarPaseador.append('direccion', this.updatedPaseadorData.direccion);
      EditarPaseador.append('descripcion', this.updatedPaseadorData.descripcion);
      EditarPaseador.append('id_barrio', this.updatedPaseadorData.id_barrio);
      EditarPaseador.append('foto_perfil', this.updatedPaseadorData.foto_perfil);

     /* console.log("Datos del EditarPaseador:");
        for (const [key, value] of EditarPaseador.entries()) {
          console.log(key + ": " + value);
          }*/
      console.log("Datos enviados al backend:", Object.fromEntries(EditarPaseador));
      PaseadoresService.update(paseadorId, EditarPaseador)
        .then(() => {
          const barrioId = this.updatedPaseadorData.id_barrio;
          const barrio = this.barrios.find((b) => b.id === barrioId);
          this.paseador.nombre_barrio = barrio ? barrio.nombre : '';

          this.$router.push("/perfil/paseador");

          // Establecer notificación y mensaje en el store
          store.commit('setNotification', 'success');
          store.commit('setMessage', 'Perfil Editado con éxito');
          setTimeout(() => {
            store.commit("setNotification", null);
            store.commit("setMessage", null);
          }, 5000); // 5 segundos en milisegundos
        })
        .catch((error) => {
          console.log("Error al actualizar el perfil del paseador: ", error);
          store.commit("setNotification", "error");
          store.commit("setMessage", "Error al editar el perfil");
          this.$router.push("/editar-paseador/");
          setTimeout(() => {
            store.commit("setNotification", null);
            store.commit("setMessage", null);
          }, 5000); // 5 segundos en milisegundos
        });
    },

    getImageUrl(filename) {
      if (filename) {
        //const imagePath = filename.replace(/\\/g, '/').replace('/vue', '');
        const imagePath = filename.replace('vue', '').replace('public', '');
        const baseUrl = window.location.origin;
        //const imageUrl = imagePath.startsWith('/vue') ? imagePath.substr(1) : imagePath;
        return `${baseUrl}/${imagePath}`;
      }
    }
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
  padding-bottom: 40px;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 15px;
}
span a{
  color: #000;
  margin-bottom: 20px;
  text-decoration: underline;
}

span a:hover{
  color: #000;
  margin-bottom: 20px;
  text-decoration: underline;
}

form{
  margin-top: 30px;
  margin-bottom: 20px;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.caja-flex{
  display: flex;
  justify-content: center;
}

.nav-link{
  display: flex;
  justify-content: center;
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
  font-size: 18px;
  padding: 8px 15px;
  cursor: pointer;
  /*width: 50%;*/
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
  /*text-align: center;*/
  /*font-weight: bold;*/
}

.error {
  background-color: #f2dede;
  color: #a94442;
}

.success {
  background-color: #dff0d8;
  color: #3c763d;
}
</style>

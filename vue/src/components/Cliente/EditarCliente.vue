<template>
    <NavCliente/>
    <div class="general">
    <div v-if="notification" class="notification" :class="notificationClass">
      {{ message }}
    </div>
    <h1>Editar perfil</h1>
    <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" v-model="updatedClienteData.nombre" required>
        </div>
        <div class="form-group">
          <label for="apellido">Apellido:</label>
          <input type="text" id="apellido" v-model="updatedClienteData.apellido" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="updatedClienteData.email" required>
        </div>
        <div class="form-group">
          <label for="telefono">Teléfono:</label>
          <input type="text" id="telefono" v-model="updatedClienteData.telefono" required>
        </div>
        <div class="form-group">
          <label for="direccion">Dirección:</label>
          <input type="text" id="direccion" v-model="updatedClienteData.direccion" required>
        </div>
        <div class="form-group">
          <label for="barrio">Barrio:</label>
          <select id="barrio" v-model="updatedClienteData.id_barrio" required>
            <option v-for="barrio in barrios" :value="barrio.id" :key="barrio.id">{{ barrio.nombre }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="nombre_perro">Nombre del Perro:</label>
          <input type="text" id="nombre_perro" v-model="updatedClienteData.nombre_perro" required>
        </div>
        <div class="form-group">
          <label for="barrio">Raza:</label>
          <select id="barrio" v-model="updatedClienteData.id_raza" required>
            <option v-for="raza in razas" :value="raza.id" :key="raza.id">{{ raza.nombre }}</option>
          </select>
        </div>
        <div class="form-group">
        <label for="foto_perfil">Foto de perfil:</label>
        <input type="file" id="foto_perfil" @change="handleFileUpload">
      </div>
        <div class="caja-flex">
          <button type="submit">Guardar cambios</button>
        </div>
        <span><router-link to="/perfil/cliente" class="nav-link">Cancelar</router-link></span>
    </form>
</div>
</template>

<script>
import ClienteService from "@/services/ClientesService";
import BarriosService from "@/services/BarriosService";
import RazasService from "@/services/RazasService";
import store from "@/store";
import NavCliente from "@/components/Nav/NavCliente.vue";

export default {
  name: "PerfilCliente",
  components: {
    NavCliente
  },
  data() {
    return {
      cliente: {},
      updatedClienteData: {},
      barrios: [],  
      razas: [],  
      file: null,    
    };
  },
  mounted() {
    const clienteId = store.getters.getClientId;
    this.fetchCliente(clienteId);
    this.fetchBarrios();
    this.fetchRazas();
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
      this.updatedClienteData.foto_perfil = event.target.files[0];
    },
    fetchCliente(clienteId) {
      ClienteService.get(clienteId)
        .then((response) => {
          this.cliente = response.data;
          this.updatedClienteData = { ...this.cliente };
        })
        .catch((error) => {
          console.log("Error al obtener el perfil del cliente: ", error);
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
    fetchRazas() {
      RazasService.getAll()
        .then((response) => {
          this.razas = response.data;
        })
        .catch((error) => {
          console.log("Error al obtener la lista de razas: ", error);
        });
    },
    updateProfile() {
      const clienteId = store.getters.getClientId;
      const EditarCliente = new FormData();
      EditarCliente.append('nombre', this.updatedClienteData.nombre);
      EditarCliente.append('apellido', this.updatedClienteData.apellido);
      EditarCliente.append('email', this.updatedClienteData.email);
      EditarCliente.append('telefono', this.updatedClienteData.telefono);
      EditarCliente.append('direccion', this.updatedClienteData.direccion);
      EditarCliente.append('id_barrio', this.updatedClienteData.id_barrio);
      EditarCliente.append('nombre_perro', this.updatedClienteData.nombre_perro);
      EditarCliente.append('id_raza', this.updatedClienteData.id_raza);
      EditarCliente.append('foto_perfil', this.updatedClienteData.foto_perfil);

      console.log("Datos enviados al backend:", Object.fromEntries(EditarCliente));
      ClienteService.update(clienteId, EditarCliente)
        .then(() => {
          const barrioId = this.updatedClienteData.id_barrio;
          const barrio = this.barrios.find((b) => b.id === barrioId);
          this.cliente.nombre_barrio = barrio ? barrio.nombre : '';

          this.$router.push("/perfil/cliente");

          // Establecer notificación y mensaje en el store
          store.commit('setNotification', 'success');
          store.commit('setMessage', 'Perfil Editado con éxito');
          setTimeout(() => {
            store.commit("setNotification", null);
            store.commit("setMessage", null);
          }, 5000); // 5 segundos en milisegundos
        })
        .catch((error) => {
          console.log("Error al actualizar el perfil del cliente: ", error);
          store.commit("setNotification", "error");
          store.commit("setMessage", "Error al editar el perfil");
          this.$router.push("/editar-cliente/");
          setTimeout(() => {
            store.commit("setNotification", null);
            store.commit("setMessage", null);
          }, 5000); // 5 segundos en milisegundos
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
</style>
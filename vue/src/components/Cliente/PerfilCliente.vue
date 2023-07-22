<template>
  <NavCliente/>
  <div class="general">
      <div v-if="notification" class="notification" :class="notificationClass">
      {{ message }}
    </div>
      <h1>Mi perfil</h1>
      <div>
        <div class="img-usuario">
          <p>Nombre: {{ cliente.nombre }} {{ cliente.apellido }}</p>
          <img class="img-perfil" :src="getImageUrl(cliente.foto_perfil || '/uploads/default-profile.png')" alt="Foto de perfil" />
        </div>
        <p>Email: {{ cliente.email }}</p>
        <p>Teléfono: {{ cliente.telefono }}</p>
        <p>Dirección: {{ cliente.direccion }}, {{ cliente.nombre_barrio }}</p>
        <p>Mi perro: {{ cliente.nombre_perro }}, {{ cliente.nombre_raza}}</p>
      </div>
    
    <router-link  :to="'/editar-cliente/'">
      <button>Editar perfil</button>
    </router-link>
    <router-link class="cambiar-contrasena"  :to="'/cambiar-contrasena/cliente'">
      <button>Cambiar contraseña</button>
    </router-link>
  </div>  
</template>
  
  
  <script>
  import ClienteService from "@/services/ClientesService";
  import BarriosService from "@/services/BarriosService";
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
        showForm: false,
        updatedClienteData: {},
        barrios: [],
        showPasswordForm: false,
        changePassword: false,
        cancelPasswordChange: false,
        
      };
    },
    mounted() {
      const clienteId = store.getters.getClientId;
      this.fetchCliente(clienteId);
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
      showEditForm() {
        this.showForm = true;
      },
      updateProfile() {
        const clienteId = store.getters.getClientId;
        ClienteService.update(clienteId, this.updatedClienteData)
          .then(() => {
            const barrioId = this.updatedClienteData.id_barrio;
            const barrio = this.barrios.find((b) => b.id === barrioId);
            this.cliente.nombre_barrio = barrio ? barrio.nombre : '';
  
            this.showForm = false;
          })
          .catch((error) => {
            console.log("Error al actualizar el perfil del cliente: ", error);
          });
      },
      cancelEdit() {
        this.showForm = false;
      },
      togglePasswordForm() {
        this.showPasswordForm = !this.showPasswordForm;
      },
      cancelPasswordForm() {
        this.showPasswordForm = false;
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
  
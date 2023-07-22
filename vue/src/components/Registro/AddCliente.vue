<template>
    <div class="general">
      <div v-if="notification" class="notification" :class="notificationClass">
      {{ message }}
      </div>
      <div class="registro">
        <h1>Registro</h1>
        <img class="canseo-img" src="http://localhost:8081/uploads/Canseo-registro.png" alt="CanSeo ">
        <form @submit.prevent="agregarCliente">
          <div class="form-group">
            <input type="text" id="nombre" v-model="nombre" required placeholder="Nombre">
          </div>
          <div class="form-group">
            <input type="text" id="apellido" v-model="apellido" required placeholder="Apellido">
          </div>
          <div class="form-group">
            <input type="email" id="email" v-model="email" required placeholder="Email">
          </div>
          <div class="form-group">
            <div class="password-input">
              <input id="password" v-model="password" :type="passwordFieldType" required placeholder="Contraseña">
              <span type="button" @click="togglePasswordVisibility">
                <img v-if="showPassword" src="http://localhost:8081/uploads/show-password.png" alt="Mostrar contraseña">
                <img v-else src="http://localhost:8081/uploads/hide-password.png" alt="Ocultar contraseña">
              </span>
            </div>
          </div>
          <div class="form-group">
            <input type="text" id="telefono" v-model="telefono" required placeholder="Teléfono">
          </div>
          <div class="form-group">
            <input type="text" id="direccion" v-model="direccion" required placeholder="Dirección">
          </div>
          <div class="form-group">
            <select id="id_barrio" v-model="idBarrio" required>
              <option value="">Seleccioná tu barrio</option>
              <option v-for="barrio in barrios" :key="barrio.id" :value="barrio.id">{{ barrio.nombre }}</option>
            </select>
          </div>
          <div class="form-group">
            <input type="text" id="nombre_perro" v-model="nombrePerro" required placeholder="Nombre de su perro">
          </div>
          <div class="form-group">
            <select id="id_raza" v-model="idRaza" required>
              <option value="">Seleccioná la raza de tu perro</option>
              <option v-for="raza in razas" :key="raza.id" :value="raza.id">{{ raza.nombre }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="foto_perfil">Foto de perfil</label>
            <input type="file" id="foto_perfil" @change="handleFileUpload">
          </div>
          <button type="submit">Registrarme</button>
        </form>
        <span><router-link to="/login/clientes" class="nav-link">¿Ya tenés una cuenta? <span class="boton-registro">Iniciar sesión</span></router-link></span>
      </div>
    </div>
  </template>
  
  <script>
  import ClientesService from "@/services/ClientesService";
  import BarriosService from "@/services/BarriosService";
  import RazasService from "@/services/RazasService";
  import store from "@/store/index";
  
  export default {
    name: "AddCliente",
    data() {
      return {
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        password: "",
        foto_perfil: "",
        idBarrio: "",
        nombrePerro: "",
        idRaza: "",
        barrios: [],
        razas: [],
        showPassword: false
      };
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
      },
      passwordFieldType() {
        return this.showPassword ? "text" : "password";
      }
    },
    mounted() {
      this.fetchBarrios();
      this.fetchRazas();
    },
    methods: {
      handleFileUpload(event) {
        this.foto_perfil = event.target.files[0];
      },
      fetchBarrios() {
        BarriosService.getAll()
          .then(response => {
            this.barrios = response.data;
          })
          .catch(error => {
            console.log(error);
          });
      },
      fetchRazas() {
        RazasService.getAll()
          .then(response => {
            this.razas = response.data;
          })
          .catch(error => {
            console.log(error);
          });
      },
      agregarCliente() {
        const nuevoCliente = new FormData();
        nuevoCliente.append('nombre', this.nombre);
        nuevoCliente.append('apellido', this.apellido);
        nuevoCliente.append('email', this.email);
        nuevoCliente.append('telefono', this.telefono);
        nuevoCliente.append('direccion', this.direccion);
        nuevoCliente.append('password', this.password);
        nuevoCliente.append('id_barrio', this.idBarrio);
        nuevoCliente.append('foto_perfil', this.foto_perfil);
        nuevoCliente.append('nombre_perro', this.nombrePerro);
        nuevoCliente.append('id_raza', this.idRaza);

      console.log("Datos enviados al backend:", Object.fromEntries(nuevoCliente));

  
        ClientesService.create(nuevoCliente)
          .then(response => {
            console.log("Cliente agregado exitosamente: ", response.data);
            // Realizar acciones adicionales después de agregar un cliente (redireccionar, mostrar mensaje, etc.)
            this.$router.push("/login/clientes");
            store.commit('setNotification', 'success');
            store.commit('setMessage', 'Registro exitoso');
          })
          .catch(error => {
            console.log("Error al agregar el cliente: ", error);
            // Manejar el error y mostrar un mensaje de error al usuario si es necesario
            store.commit("setNotification", "error");
            store.commit("setMessage", "Error al realizar el registro");
            this.$router.push("/registro/cliente");
            setTimeout(() => {
              store.commit("setNotification", null);
              store.commit("setMessage", null);
            }, 5000); // 5 segundos en milisegundos
          });
      },
      togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
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
  padding-bottom: 40px;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 15px;
}

.canseo-img{
  width: 180px;
}

.registro{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

form{
  margin-top: 30px;
  margin-bottom: 20px;
  width: 80%;
  display: flex;
  flex-direction: column;
}

span a{
  color: #000;
  margin-bottom: 20px;
}

.paseadores{
  font-weight: 600;
}

.form-group {
  margin-bottom: 30px;
}

label {
  display: block;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 5px;
  border: 0px solid;
  border-bottom: 1px solid #000;
}

select{
  width: 100%;
  padding: 5px;
  border: 0px solid;
  border-bottom: 1px solid #000;
}

button {
  border-radius: 5px;
  border: 1px solid #8DBD47;
  background-color: #8DBD47;
  font-size: 18px;
  padding: 8px 15px;
  cursor: pointer;
  width: 50%;
  align-self: center;
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

.password-input {
  position: relative;
}

.password-input span {
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.password-input span:focus {
  outline: none;
}

.password-input img {
  width: 20px;
  height: 20px;
}

.boton-registro{
text-decoration: underline;  
}
  </style>
  
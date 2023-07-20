<template>
  <div class="general">
    <div v-if="notification" class="notification" :class="notificationClass">
      {{ message }}
    </div>
    <div class="registro">
      <h1>Registro paseador</h1>
      <img class="canseo-img" src="http://localhost:8081/uploads/Canseo-registro.png" alt="CanSeo">
      <form @submit.prevent="agregarPaseador">
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
          <input type="text" id="telefono" v-model="telefono" required placeholder="Teléfono">
        </div>
        <div class="form-group">
          <input type="text" id="direccion" v-model="direccion" required placeholder="Dirección">
        </div>
        <div class="form-group">
          <textarea id="descripcion" rows="1" v-model="descripcion" required placeholder="Descripción"></textarea>
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
          <select id="id_barrio" v-model="idBarrio" required class="select-barrio">
            <option value="">Seleccioná tu barrio</option>
            <option v-for="barrio in barrios" :key="barrio.id" :value="barrio.id">{{ barrio.nombre }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="dias_disponibles">Días disponibles<span> (<span class="circulo-verde"></span> Días Seleccionados)</span></label>
          <div class="">
            <div class="selected-items">
  <div v-for="(dia, index) in diasDisponibles" :key="index" class="selected-item" :class="{ active: selectedDias.includes(dia) }" @click="toggleDiaSeleccionado(dia)">
    {{ dia === 'domingo' ? 'Domingo' : (dia === 'lunes' ? 'Lunes' : (dia === 'martes' ? 'Martes' : (dia === 'miercoles' ? 'Miércoles' : (dia === 'jueves' ? 'Jueves' : (dia === 'viernes' ? 'Viernes' : (dia === 'sabado' ? 'Sábado' : dia)))))) }}
  </div>
</div>

          </div>
        </div>
        <div class="form-group">
          <label for="foto_perfil">Foto de perfil</label>
          <input type="file" id="foto_perfil" @change="handleFileUpload">
        </div>
        <button type="submit">Registrarme</button>
      </form>
      <span><router-link to="/login/paseadores" class="nav-link">¿Ya tenés una cuenta? <span class="boton-registro">Iniciar sesión</span></router-link></span>
    </div>
  </div>
</template>

<script>
import PaseadoresService from "@/services/PaseadoresService";
import BarriosService from "@/services/BarriosService";
import store from "@/store/index";

export default {
  name: "AddPaseador",
  data() {
    return {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      descripcion: "",
      password: "",
      idBarrio: "",
      foto_perfil: "",
      diasDisponibles: ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
      selectedDias: [],
      barrios: [],
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
    this.selectedDias = [...this.diasDisponibles]; // Todos los días seleccionados por defecto
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
    agregarPaseador() {
const nuevoPaseador = new FormData();
nuevoPaseador.append('nombre', this.nombre);
nuevoPaseador.append('apellido', this.apellido);
nuevoPaseador.append('email', this.email);
nuevoPaseador.append('telefono', this.telefono);
nuevoPaseador.append('direccion', this.direccion);
nuevoPaseador.append('descripcion', this.descripcion);
nuevoPaseador.append('password', this.password);
nuevoPaseador.append('foto_perfil', this.foto_perfil);
nuevoPaseador.append('id_barrio', this.idBarrio);

if (this.selectedDias.length === 1) {
    nuevoPaseador.append('dias_disponibles', [this.selectedDias[0]]);
  } else {
    for (const dia of this.selectedDias) {
      nuevoPaseador.append('dias_disponibles', dia);
    }
  }
      console.log("Datos enviados al backend:", nuevoPaseador);

      PaseadoresService.create(nuevoPaseador)
        .then(response => {
          console.log("Paseador agregado exitosamente: ", response.data);
          // Realizar acciones adicionales después de agregar un paseador (redireccionar, mostrar mensaje, etc.)
          this.$router.push("/login/paseadores");
          store.commit("setNotification", "success");
          store.commit("setMessage", "Registro exitoso");
        })
        .catch(error => {
          console.log("Error al agregar el paseador: ", error);
          // Manejar el error y mostrar un mensaje de error al usuario si es necesario
          store.commit("setNotification", "error");
          store.commit("setMessage", "Error al realizar el registro");
          this.$router.push("/registro/paseador");
          setTimeout(() => {
            store.commit("setNotification", null);
            store.commit("setMessage", null);
          }, 5000); // 5 segundos en milisegundos
        });
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleDiaSeleccionado(dia) {
      if (this.selectedDias.includes(dia)) {
        this.selectedDias = this.selectedDias.filter(item => item !== dia);
      } else {
        this.selectedDias.push(dia);
      }
    }
  }
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

.canseo-img {
  width: 180px;
}

.registro {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

form {
  margin-top: 30px;
  margin-bottom: 20px;
  width: 80%;
  display: flex;
  flex-direction: column;
}

span a {
  color: #000;
  margin-bottom: 20px;
}

.paseadores {
  font-weight: 600;
}

.form-group {
  margin-bottom: 30px;
}

label {
  display: block;
  font-weight: bold;
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

input,
textarea {
  width: 100%;
  padding: 5px;
  border: 0px solid;
  border-bottom: 1px solid #000;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper::after {
  content: "\25BC";
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none;
}

.select-wrapper select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  border: 1px solid #000;
  padding: 5px;
  width: 100%;
}

.custom-select {
  position: relative;
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  
}

.select-barrio{
  width: 100%;
  padding: 5px;
  border: 0px solid;
  border-bottom: 1px solid #000;
}

.selected-item {
  display: flex;
  align-items: center;
  margin-right: 5px;
  margin-bottom: 5px;
  background-color: #ddd;
  padding: 2px 5px;
  border-radius: 5px;
  cursor: pointer;
}

.selected-item.active {
  background-color: #8dbd47;
  color: #fff;
}

.selected-item.active:hover {
  background-color: #6d9e3f;
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

.circulo-verde{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #6d9e3f;
  
}

label span{
  font-weight: 400;
}
</style>

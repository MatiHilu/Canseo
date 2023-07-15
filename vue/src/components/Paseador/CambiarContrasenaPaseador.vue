<template>
  <NavPaseador/>
  <div class="general">
    <div v-if="notification" class="notification" :class="notificationClass">
      {{ message }}
    </div>
    <div class="password-form">
      <h2>Cambiar Contraseña</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group password-input">
          <label for="current-password">Contraseña Actual:</label>
          <input id="current-password" v-model="currentPassword" :type="currentPasswordFieldType" required placeholder="Contraseña actual">
          <span type="button" @click="toggleCurrentPasswordVisibility">
            <img v-if="showCurrentPassword" src="http://localhost:8081/uploads/show-password.png" alt="Mostrar contraseña">
            <img v-else src="http://localhost:8081/uploads/hide-password.png" alt="Ocultar contraseña">
          </span>
        </div>
        <div class="form-group password-input">
          <label for="new-password">Nueva Contraseña:</label>
          <input id="new-password" v-model="newPassword" :type="newPasswordFieldType" required placeholder="Nueva contraseña">
          <span type="button" @click="toggleNewPasswordVisibility">
            <img v-if="showNewPassword" src="http://localhost:8081/uploads/show-password.png" alt="Mostrar contraseña">
            <img v-else src="http://localhost:8081/uploads/hide-password.png" alt="Ocultar contraseña">
          </span>
        </div>
        <div class="form-group password-input">
          <label for="confirm-password">Confirmar Contraseña:</label>
          <input id="confirm-password" v-model="confirmPassword" :type="confirmPasswordFieldType" required placeholder="Confirmar contraseña">
          <span type="button" @click="toggleConfirmPasswordVisibility">
            <img v-if="showConfirmPassword" src="http://localhost:8081/uploads/show-password.png" alt="Mostrar contraseña">
            <img v-else src="http://localhost:8081/uploads/hide-password.png" alt="Ocultar contraseña">
          </span>
        </div>
        <button type="submit">Guardar Cambios</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import PaseadoresService from "@/services/PaseadoresService";
import store from "@/store";
import NavPaseador from "@/components/Nav/NavPaseador.vue";

export default {
  name: "CambiarContrasenalPaseador",
  components: {
    NavPaseador
  },
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      errorMessage: "",
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false
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
    currentPasswordFieldType() {
      return this.showCurrentPassword ? "text" : "password";
    },
    newPasswordFieldType() {
      return this.showNewPassword ? "text" : "password";
    },
    confirmPasswordFieldType() {
      return this.showConfirmPassword ? "text" : "password";
    }
  },
  methods: {
    submitForm() {
      if (this.newPassword !== this.confirmPassword) {
        store.commit("setNotification", "error");
        store.commit("setMessage", "Las contraseñas no coinciden");
        this.$router.push("/cambiar-contrasena/paseador");
        setTimeout(() => {
          store.commit("setNotification", null);
          store.commit("setMessage", null);
        }, 5000); // 5 segundos en milisegundos
        return;
      }

      const paseadorId = store.getters.getClientId;
      const cambioContraseñaData = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      };

      PaseadoresService.changePassword(paseadorId, cambioContraseñaData)
        .then(() => {
          // Realizar acciones adicionales después de cambiar la contraseña (redireccionar, mostrar mensaje, etc.)
          // Establecer notificación y mensaje en el store
          store.commit("setNotification", "success");
          store.commit("setMessage", "Contraseña cambiada con éxito");
          this.$router.push("/perfil/paseador");
          setTimeout(() => {
            store.commit("setNotification", null);
            store.commit("setMessage", null);
          }, 5000); // 5 segundos en milisegundos
        })
        .catch((error) => {
          console.log("Error al cambiar la contraseña del paseador: ", error);
          store.commit("setNotification", "error");
          store.commit("setMessage", "Error al cambiar la contraseña");
          this.$router.push("/cambiar-contrasena/paseador");
          setTimeout(() => {
            store.commit("setNotification", null);
            store.commit("setMessage", null);
          }, 5000); // 5 segundos en milisegundos
        });
    },
    toggleCurrentPasswordVisibility() {
      this.showCurrentPassword = !this.showCurrentPassword;
    },
    toggleNewPasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
};
</script>

<style scoped>
.general {
  min-height: 60vh;
  /*Hace que el footer quede pegado abajo incluso cuando no haya suficiente contenido*/
  margin: 0 auto;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 15px;
  padding-bottom: 40px;
}

.password-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
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

input[type="password"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #000;
  border-radius: 3px;
}

button[type="submit"] {
  border-radius: 5px;
  border: 1px solid #8DBD47;
  background-color: #8DBD47;
  font-size: 14px;
  padding: 3px 15px;
  width: 100%;
  height: 40px;
  margin-top: 15px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.error-message {
  color: red;
  margin-top: 5px;
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
  top: 70%;
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

input {
  width: 100%;
  padding: 5px;
  border: 0px solid;
  border-bottom: 1px solid #000;
}
</style>

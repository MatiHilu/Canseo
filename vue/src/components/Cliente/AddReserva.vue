<template>
  <NavCliente/>
  <div class="general">
    <h1>Crear Reserva</h1>
      <div v-if="errorMessage || error" class="notification error" :class="notificationClass">
        {{ errorMessage || error }}
    </div>
    <form @submit.prevent="crearReserva">

      <div class="form-group">
        <label for="fecha-reserva">Fecha del paseo:</label>
        <div class="input-with-icon">
          <input style="width: 100% !important;" type="text" id="fecha-reserva" v-model="fecha" required>
          <span class="input-icon">
            <img src="http://localhost:8081/uploads/calendar.png" alt="Ícono de fecha">
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="hora">Hora:</label>
        <div class="input-with-icon">
          <select id="hora" v-model="hora" required>
            <option value="">Seleccionar rango horario del paseo</option>
            <option v-for="hour in availableHours" :key="hour" :value="hour">{{ hour }}</option>
          </select>
          <span class="input-icon">
            <img src="http://localhost:8081/uploads/clock.png" alt="Ícono de hora">
          </span>
        </div>
      </div>
      
      <button class="reservar-paseador" type="submit">Crear Reserva</button>
    </form>
  </div>
</template>

<script>
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import NavCliente from "@/components/Nav/NavCliente.vue";
import ReservasService from "@/services/ReservasService";
import store from "@/store/index";

export default {
  name: "AddReserva",
  components: {
    NavCliente,
  },
  data() {
    return {
      fecha: "",
      hora: "",
      errorMessage: "",
      error: "",
    };
  },
  mounted() {
    flatpickr('#fecha-reserva', {
      minDate: moment().add(1, 'day').toDate(), // Establecer la fecha mínima a partir del día siguiente a hoy
      maxDate: new Date().fp_incr(30),
      dateFormat: 'd/m/Y', // Formato de fecha DD/MM/YYYY
      onChange: (selectedDates, dateStr) => {
        this.fecha = moment(dateStr, 'DD/MM/YYYY').format('DD/MM/YYYY');
      }
    });
  },
  computed: {
    availableHours() {
      const hours = [
        '7:00 - 11:00',
        '13:00 - 17:00',
        '18:00 - 22:00'
      ];
      return hours;
    },
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
    crearReserva() {
      if (!this.validateReservation()) {
        return;
      }

      const nuevaReserva = {
        id_paseador: this.$route.params.id,
        id_cliente: store.getters.getClientId,
        fecha: moment(this.fecha, 'DD/MM/YYYY').format('YYYY/MM/DD'), // Convertir la fecha al formato YYYY/MM/DD
        hora: this.hora,
      };

      ReservasService.create(nuevaReserva)
        .then((response) => {
          console.log("Reserva creada exitosamente: ", response.data);
          // Realizar acciones adicionales después de crear una reserva (redireccionar, mostrar mensaje, etc.)
          this.$router.push("/reservas-cliente");
        })
        .catch((error) => {
          console.log("Error al crear la reserva: ", error);
          this.error = "Error al crear la reserva." + error;
        });
    },
    validateReservation() {
      if (!this.fecha) {
        this.errorMessage = "Por favor, seleccione una fecha.";
        return false;
      }

      if (!this.hora) {
        this.errorMessage = "Por favor, seleccione una hora.";
        return false;
      }

      this.errorMessage = "";
      return true;
    },
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

.reservar-paseador{
  border-radius: 5px;
  border: 1px solid #8DBD47;
  background-color: #8DBD47;
  font-size: 14px;
  padding: 3px 15px;
  width: 100%;
  height: 40px;
  margin-top: 45px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

form{
  width: 100%;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  font-weight: bold;
}

.option[focus]{
  padding: 5px;
  background: #000;
}

select,
input[type="text"]{
  width: 100%;
  padding: 5px;
  border: 1px solid #000;
  border-radius: 3px;
}

.error-message {
  color: red;
  margin-top: 5px;
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

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
}

.input-icon img {
  width: 20px;
  height: 20px;
}
</style>

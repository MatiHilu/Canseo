<template>
  <NavPaseador />
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
        <label for="dias_disponibles">Días disponibles<span> (<span class="circulo-verde"></span> Días
            Seleccionados)</span></label>
        <div>
          <div class="selected-items">
            <div v-for="(dia, index) in diasDisponibles" :key="index" class="selected-item"
              :class="{ active: selectedDias.includes(dia) }" @click="toggleDiaSeleccionado(dia)">
              {{ dia === 'domingo' ? 'Domingo' : (dia === 'lunes' ? 'Lunes' : (dia === 'martes' ? 'Martes' : (dia === 'miercoles' ? 'Miércoles' : (dia === 'jueves' ? 'Jueves' : (dia === 'viernes' ? 'Viernes' : (dia === 'sabado' ? 'Sábado' : mapeoDias[dia])))))) }}
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="foto_perfil">Cambiar foto de perfil</label>
        <input type="file" id="foto_perfil" @change="handleFileUpload">
        <div class="foto-flex">
          <span class="span-foto">Foto de perfil actual</span>
          <img class="img-perfil" :src="getImageUrl(paseador.foto_perfil || '/uploads/default-profile.png')"
          alt="Foto de perfil">
        </div>
        
      </div>
      <div class="caja-flex">
        <button type="submit">Guardar cambios</button>
      </div>
      <span>
        <router-link to="/perfil/paseador" class="nav-link">Cancelar</router-link>
      </span>
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
        diasDisponibles: ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
        selectedDias: [],
        mapeoDias: {
          domingo: "domingo",
          lunes: "lunes",
          martes: "martes",
          miercoles: "miercoles",
          jueves: "jueves",
          viernes: "viernes",
          sabado: "sabado",
        },
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
          success: this.notification === "success",
        };
      },
    },
    methods: {
      handleFileUpload(event) {
        this.updatedPaseadorData.foto_perfil = event.target.files[0];
      },
      fetchPaseador(paseadorId) {
        PaseadoresService.get(paseadorId)
          .then((response) => {
            this.paseador = response.data;
            this.updatedPaseadorData = {
              ...this.paseador
            };
            this.selectedDias = this.paseador.dias_disponibles.map((dia) => {
              return this.mapeoDias[dia];
            });
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
        EditarPaseador.append("nombre", this.updatedPaseadorData.nombre);
        EditarPaseador.append("apellido", this.updatedPaseadorData.apellido);
        EditarPaseador.append("email", this.updatedPaseadorData.email);
        EditarPaseador.append("telefono", this.updatedPaseadorData.telefono);
        EditarPaseador.append("direccion", this.updatedPaseadorData.direccion);
        EditarPaseador.append("descripcion", this.updatedPaseadorData.descripcion);
        EditarPaseador.append("id_barrio", this.updatedPaseadorData.id_barrio);
        EditarPaseador.append("foto_perfil", this.updatedPaseadorData.foto_perfil);

        const diasDisponibles = this.selectedDias.map((dia) => {
          return this.diasDisponibles.find((d) => this.mapeoDias[d] === dia);
        });
        for (const dia of diasDisponibles) {
          EditarPaseador.append("dias_disponibles[]", dia);
        }

        console.log("Datos enviados al backend:", Object.fromEntries(EditarPaseador));
        PaseadoresService.update(paseadorId, EditarPaseador)
          .then(() => {
            const barrioId = this.updatedPaseadorData.id_barrio;
            const barrio = this.barrios.find((b) => b.id === barrioId);
            this.paseador.nombre_barrio = barrio ? barrio.nombre : "";

            this.$router.push("/perfil/paseador");

            // Establecer notificación y mensaje en el store
            store.commit("setNotification", "success");
            store.commit("setMessage", "Perfil Editado con éxito");
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
      toggleDiaSeleccionado(dia) {
        if (this.selectedDias.includes(dia)) {
          this.selectedDias = this.selectedDias.filter((item) => item !== dia);
        } else {
          this.selectedDias.push(dia);
        }
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

  span a {
    color: #000;
    margin-bottom: 20px;
    text-decoration: underline;
  }

  .img-perfil {
    width: 120px;
    border-radius: 100px;
  }

  .foto-flex{
    display: flex;
    align-items: center;
    margin-top: 20px;
  }

  .span-foto{
    font-weight: 600;
    margin-right: 20px;
  }

  form {
    margin-top: 30px;
    margin-bottom: 20px;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }

  .caja-flex {
    display: flex;
    justify-content: center;
  }

  .nav-link {
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

  .selected-items {
    display: flex;
    flex-wrap: wrap;
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
  }

  .error {
    background-color: #f2dede;
    color: #a94442;
  }

  .success {
    background-color: #dff0d8;
    color: #3c763d;
  }

  .circulo-verde {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #6d9e3f;
  }
</style>

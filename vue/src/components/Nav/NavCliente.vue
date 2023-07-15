<template>
  <div>
    <!-- Menú hamburguesa -->
    <div v-if="isMobile">
      <div class="menu-mobile-box">
        <router-link to="/" class="navbar-brand img-canseo-mobile">
          <img src="http://localhost:8081/uploads/CanSeo.png" alt="CanSeo">
        </router-link>
        <div @click="toggleMobileMenu" class="menu-button">
          <img class="icon" src="http://localhost:8081/uploads/imagen-hamburguesa.png" alt="Menú Hamburguesa">
        </div>
      </div>
      
      <div :class="{ 'mobile-menu': true, 'open': isMobileMenuOpen }">
        <div @click="toggleMobileMenu" class="close-button">
          <img class="icon" src="http://localhost:8081/uploads/imagen-cerrar.png" alt="Cerrar Menú">
        </div>
        <!-- Contenido del menú -->
        <div class="navbar-nav mr-auto">
            <li class="nav-item">
                <router-link to="/lista-paseadores" class="nav-link">Paseadores</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/reservas-cliente" class="nav-link">Reservas</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/perfil/cliente" class="nav-link">Perfil</router-link>
            </li>
        </div>
        <div class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" @click="logout">Cerrar sesión</a>
            </li>
        </div>
      </div>
    </div>
  
    <!-- Menú normal -->
  <nav class="navbar navbar-expand navbar-light" v-else>
      <!-- Contenido del menú -->
      <router-link to="/" class="navbar-brand">
        <img src="http://localhost:8081/uploads/CanSeo.png" alt="CanSeo">
      </router-link>
      <div class="navbar-nav mr-auto mtop-10">
            <li class="nav-item">
                <router-link to="/lista-paseadores" class="nav-link">Paseadores</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/reservas-cliente" class="nav-link">Reservas</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/perfil/cliente" class="nav-link">Perfil</router-link>
            </li>
        </div>
        <div class="navbar-nav mtop-10">
            <li class="nav-item">
                <a class="nav-link" @click="logout">Cerrar sesión</a>
            </li>
        </div>
    </nav>
  </div>
</template>
  
  <script>
  import store from "@/store/index";
  export default {
    name: 'NavCliente',
    data() {
    return {
      isMobileMenuOpen: false,
      isMobile: window.innerWidth <= 768 // Define el ancho máximo para considerar como pantalla de móvil
      };
    },
    created() {
      window.addEventListener('resize', this.handleResize);
    },
    unmounted() {
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      logout() {
        store.dispatch("logout");
        store.commit("setNotification", "success");
        store.commit("setMessage", "Sesión cerrada correctamente");
        this.$router.push('/login/clientes');
        setTimeout(() => {
          store.commit("setNotification", null);
          store.commit("setMessage", null);
        }, 10000); // 5 segundos en milisegundos
      },
      handleResize() {
        this.isMobile = window.innerWidth <= 768;
      },
      toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
      }
    },
  };

  </script>
  
  <style scoped>
  .nav-link{
    cursor: pointer;
  }

  a{
    color: #000;
  }

  nav img{
    width: 120px;
  }
  .img-canseo-mobile{
    width: 110px;
  }

  .img-canseo-mobile img{
    width: 110px;
  }
  .menu-mobile-box{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px 0 10px;
  }

  .menu-button img{
    width: 45px;
    margin-top: 5px;
  }

  .close-button img{
    width: 25px;
    margin-top: 15px;
    margin-right: 5px;
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    right: 0;
    width: 70%;
    height: 100vh;
    background-color: #fff;
    z-index: 999;
    padding: 22px;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
  }

  .mobile-menu.open {
    transform: translateX(0);
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .mtop-10{
    margin-top: 10px;
  }


  </style>
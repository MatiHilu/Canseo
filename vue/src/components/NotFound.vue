<template>
  <div class="general">
    <router-link to="/" class="img-canseo">
      <img src="http://localhost:8081/uploads/Canseo-login.png" alt="CanSeo">
    </router-link>
    <h1>404 - Página no encontrada</h1>
    <p>La página que estás buscando no existe.</p>
    <router-link to="/" class="button">
      Volver a CanSeo
    </router-link>
  </div>

</template>

<style scoped>
  .general{
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-size: 24px;
    text-align: center;
  }
  
  p {
    text-align: center;
    color: #888;
  }

  .img-canseo{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  }

  .img-canseo img{
    width: 40%;
  }

  .button {
    border-radius: 5px;
    border: 1px solid #8DBD47;
    background-color: #8DBD47;
    font-size: 18px;
    padding: 8px 15px;
    cursor: pointer;
    width: 50%;
    align-self: center;
    text-align: center;
    color: #000;
  }

  .button:hover{
    text-decoration: none;
  }

</style>
  
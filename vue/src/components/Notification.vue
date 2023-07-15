<template>
    <div v-if="message" :class="['notification', variant]">
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    name: "Notification",
    props: {
      message: String,
      variant: {
        type: String,
        default: "success", // Variante por defecto
        validator: (variant) => ["success", "error"].includes(variant), // Validar las variantes permitidas
      },
    },
  };
  </script>
  
  <style scoped>
  .notification {
    padding: 10px;
    border-radius: 4px;
  }
  
  .success {
    background-color: #dff0d8;
    color: #3c763d;
  }
  
  .error {
    background-color: #f2dede;
    color: #a94442;
  }
  </style>
  
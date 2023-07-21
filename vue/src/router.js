import { createWebHistory, createRouter } from "vue-router";
import AuthService from '@/services/AuthService';


const routes = [
  {
    
    path: "/lista-paseadores",
    name: "paseadores",
    component: () => import("./components/Cliente/PaseadoresList.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/login/clientes",
    name: "login-cliente",
    component: () => import("./components/Login/LoginCliente.vue"),
  },
  {
    path: "/login/paseadores",
    name: "login-paseadores",
    component: () => import("./components/Login/LoginPaseador.vue"),
  },
  {
    path: "/registro/paseador",
    name: "add-paseador",
    component: () => import("./components/Registro/AddPaseador.vue"),
  },
  {
    path: "/registro/cliente",
    name: "add-cliente",
    component: () => import("./components/Registro/AddCliente.vue"),
  },
  {
    path: "/reservas-cliente",
    name: "reservas-cliente",
    component: () => import("./components/Cliente/ReservasCliente.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/",
    alias: "/reservar",
    name: "add-reserva",
    component: () => import("./components/Cliente/AddReserva.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/reservas-paseador",
    name: "reservas-paseador",
    component: () => import("./components/Paseador/ReservasPaseador.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: '/paseador/:id',
    name: 'PaseadorIndividual',
    component: () => import("./components/Cliente/PaseadorIndividual.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil/paseador',
    name: 'PerfilPaseador',
    component: () => import("./components/Paseador/PerfilPaseador.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil/cliente',
    name: 'PerfilCliente',
    component: () => import("./components/Cliente/PerfilCliente.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: '/editar-cliente',
    name: 'EditarCliente',
    component: () => import("./components/Cliente/EditarCliente.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: '/editar-paseador',
    name: 'EditarPaseador',
    component: () => import("./components/Paseador/EditarPaseador.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: '/cambiar-contrasena/cliente',
    name: 'CambiarContrasenaCliente',
    component: () => import("./components/Cliente/CambiarContrasenaCliente.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: '/cambiar-contrasena/paseador',
    name: 'CambiarContrasenaPaseador',
    component: () => import("./components/Paseador/CambiarContrasenaPaseador.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import("./components/NotFound.vue"),
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !AuthService.isAuthenticated()) {
    // Usuario no autenticado, redirigir al formulario de inicio de sesión
    next({ name: 'login-cliente' });
  } else {
    // Usuario autenticado o ruta no requerida para autenticación, continuar con la navegación
    next();
  }
});

export default router;

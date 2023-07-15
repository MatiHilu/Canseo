import http from "../http-common";
import AuthService from "./AuthService";

const ClientesService = {
  getAll() {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.get("/clientes");
  },

  login(data) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.post("/clientes/login", data);
  },

  get(id) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.get(`/clientes/${id}`);
  },

  create(data) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.post("/clientes/register", data);
  },

  update(id, data) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.put(`/clientes/${id}`, data);
  },

  changePassword(id, data) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.put(`/clientes/${id}/change-password`, data);
  },

  delete(id) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.delete(`/clientes/${id}`);
  },

  deleteAll() {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.delete(`/clientes`);
  }
};

export default ClientesService;

import http from "../http-common";
import AuthService from "./AuthService";

const PaseadoresService = {
  getAll() {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.get("/paseadores");
  },

  getByBarrio(clienteId, diaSemana, fecha, hora) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.get(`/paseadores/by-barrio/${clienteId}?diaSemana=${diaSemana}&fecha=${fecha}&hora=${hora}`, {
      params: {
        dia_semana: diaSemana
      }
    });
  },

  login(data) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.post("/paseadores/login", data);
  },

  get(id) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.get(`/paseadores/${id}`);
  },

  create(data) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.post("/paseadores/register", data);
  },

  update(paseadorId, data) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.put(`/paseadores/${paseadorId}`, data);
  },

  changePassword(id, data) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.put(`/paseadores/${id}/change-password`, data);
  },

  delete(id) {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.delete(`/paseadores/${id}`);
  },

  deleteAll() {
    // Configurar el encabezado de autorización
    AuthService.setAuthHeader();

    return http.delete(`/paseadores`);
  }
};

export default PaseadoresService;

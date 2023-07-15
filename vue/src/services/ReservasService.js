import http from "../http-common";

const ReservasService = {
  getAll() {
    return http.get("/reservas");
  },

  get(id) {
    return http.get(`/reservas/${id}`);
  },

  create(data) {
    return http.post("/reservas", data);
  },

  update(id, data) {
    return http.put(`/reservas/${id}`, data);
  },

  delete(id) {
    return http.delete(`/reservas/${id}`);
  },

  deleteAll() {
    return http.delete(`/reservas`);
  },

  getReservasByUserId(id_cliente) {
    return http.get(`/reservas/user/${id_cliente}`);
  },

  getReservasByPaseadorId(id_paseador) {
    return http.get(`/reservas/paseador/${id_paseador}`);
  },

  getReservasPendientes() {
    return http.get("/reservas/pendientes");
  },

  getReservasRealizadas() {
    return http.get("/reservas/realizadas");
  },
  
  updateEstado(reservaId, nuevoEstado) {
    return http.patch(`/reservas/${reservaId}/estado`, { estado: nuevoEstado });
  },
  
};

export default ReservasService;

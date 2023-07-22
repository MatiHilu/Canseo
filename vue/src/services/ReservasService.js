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

  getReservasFiltradas(id_cliente, fecha) {
    
    return http.get(`/reservas/filtered/${id_cliente}?fecha=${fecha.fecha}&hora=${fecha.hora}&estado=${fecha.estado}`);
  },

  getReservasFiltradasPaseador(id_paseador, fecha) {
    
    return http.get(`/reservas/filteredPaseador/${id_paseador}?fecha=${fecha.fecha}&hora=${fecha.hora}&estado=${fecha.estado}`);
  },
  
  updateEstado(reservaId, nuevoEstado) {
    return http.patch(`/reservas/${reservaId}/estado`, { estado: nuevoEstado });
  },
  
};

export default ReservasService;

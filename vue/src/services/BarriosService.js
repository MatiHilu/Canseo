import http from "../http-common";

const BarriosService = {
  getAll() {
    return http.get("/barrios");
  },

  get(id) {
    return http.get(`/barrios/${id}`);
  },

};

export default BarriosService;

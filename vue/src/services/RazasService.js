import http from "../http-common";

const RazasService = {
  getAll() {
    return http.get("/razas");
  },

  get(id) {
    return http.get(`/razas/${id}`);
  },

};

export default RazasService;

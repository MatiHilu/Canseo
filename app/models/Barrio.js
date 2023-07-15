const sql = require("./db.js");

const Barrio = function (barrio) {
  this.id = barrio.id;
  this.nombre = barrio.nombre;
};

Barrio.getAll = (result) => {
  sql.query("SELECT * FROM Barrios", (err, res) => {
    if (err) {
      console.log("Error al obtener los barrios: ", err);
      result(null, err);
      return;
    }

    console.log("Barrios obtenidos con éxito.");
    result(null, res);
  });
};

Barrio.findById = (id, result) => {
  sql.query(`SELECT * FROM Barrios WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("Error al obtener el barrio: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("Barrio encontrado: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

module.exports = Barrio;

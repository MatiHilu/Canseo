const sql = require("./db.js");

const Raza = function (raza) {
  this.nombre = raza.nombre;
};

Raza.findById = (id, result) => {
  sql.query(`SELECT * FROM Razas WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found raza: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Raza.getAll = result => {
  sql.query("SELECT * FROM Razas", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("razas: ", res);
    result(null, res);
  });
};

module.exports = Raza;

const sql = require("./db.js");

const Reserva = function (reserva) {
  this.id_paseador = reserva.id_paseador;
  this.id_cliente = reserva.id_cliente;
  this.fecha = reserva.fecha;
  this.hora = reserva.hora;
  this.estado = reserva.estado || "pendiente";
};

Reserva.create = (newReserva, result) => {
  sql.query("INSERT INTO Reservas SET ?", newReserva, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created reserva: ", {
      id: res.insertId,
      ...newReserva
    });
    result(null, {
      id: res.insertId,
      ...newReserva
    });
  });
};

Reserva.findById = (id, result) => {
  sql.query(`SELECT * FROM Reservas WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found reserva: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({
      kind: "not_found"
    }, null);
  });
};

Reserva.getAll = (result) => {
  sql.query("SELECT * FROM Reservas", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("reservas: ", res);
    result(null, res);
  });
};

Reserva.getReservasByUserId = (id_cliente, result) => {
  sql.query(
    `SELECT r.*, p.nombre, p.apellido, p.foto_perfil FROM Reservas r INNER JOIN Paseadores p ON r.id_paseador = p.id WHERE r.id_cliente = ${id_cliente}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("reservas del usuario: ", res);
      result(null, res);
    }
  );
};

Reserva.getReservasByPaseadorId = (id_paseador, result) => {
  sql.query(
    `SELECT r.*, c.nombre, c.apellido, c.foto_perfil, c.direccion, c.nombre_perro, c.id_raza, rz.nombre AS nombre_raza
  FROM Reservas r
  INNER JOIN Clientes c ON r.id_cliente = c.id
  INNER JOIN Paseadores p ON r.id_paseador = p.id
  INNER JOIN Razas rz ON c.id_raza = rz.id
  WHERE r.id_paseador = ${id_paseador}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("reservas del paseador: ", res);
      result(null, res);
    }
  );
};



Reserva.updateEstadoById = (id, estado, result) => {
  sql.query(
    "UPDATE Reservas SET estado = ? WHERE id = ?",
    [estado, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({
          kind: "not_found"
        }, null);
        return;
      }

      console.log("updated reserva: ", {
        id: id,
        estado: estado
      });
      result(null, {
        id: id,
        estado: estado
      });
    }
  );
};


Reserva.updateById = (id, reserva, result) => {
  sql.query(
    "UPDATE Reservas SET id_paseador = ?, id_cliente = ?, fecha = ?, hora = ?, estado = ? WHERE id = ?",
    [reserva.id_paseador, reserva.id_cliente, reserva.fecha, reserva.hora, reserva.estado, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({
          kind: "not_found"
        }, null);
        return;
      }

      console.log("updated reserva: ", {
        id: id,
        ...reserva
      });
      result(null, {
        id: id,
        ...reserva
      });
    }
  );
};

Reserva.remove = (id, result) => {
  sql.query("DELETE FROM Reservas WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({
        kind: "not_found"
      }, null);
      return;
    }

    console.log("deleted reserva with id: ", id);
    result(null, res);
  });
};

Reserva.removeAll = (result) => {
  sql.query("DELETE FROM Reservas", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} reservas`);
    result(null, res);
  });
};

Reserva.countReservations = (id_paseador, fecha, hora, result) => {
  sql.query(
    "SELECT COUNT(*) AS count FROM Reservas WHERE id_paseador = ? AND fecha = ? AND hora = ?",
    [id_paseador, fecha, hora],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("reservations count: ", res[0].count);
      result(null, res[0].count);
    }
  );
};

Reserva.getReservasFiltradas = (clienteId, fecha, hora, estado, result) => {
  let query = `
  SELECT r.*, p.*
  FROM Reservas r
  JOIN Paseadores p ON r.id_paseador = p.id
  WHERE r.id_cliente = ?`;
  const queryParams = [clienteId];

  if (fecha) {
    query += " AND fecha = ?";
    queryParams.push(fecha);
  }

  if (hora) {
    query += " AND hora = ?";
    queryParams.push(hora);
  }

  if (estado) {
    query += " AND estado = ?";
    queryParams.push(estado);
  }

  sql.query(query, queryParams, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("reservas filtradas: ", res);
    result(null, res);
  });
};

Reserva.getReservasFiltradasPaseador = (clienteId, fecha, hora, estado, result) => {
  let query = `
  SELECT r.*, c.*, rz.nombre AS nombre_raza
  FROM Reservas r
  JOIN Clientes c ON r.id_cliente = c.id
  INNER JOIN Razas rz ON c.id_raza = rz.id
  WHERE r.id_paseador = ?
  `;
  const queryParams = [clienteId];

  if (fecha) {
    query += " AND fecha = ?";
    queryParams.push(fecha);
  }

  if (hora) {
    query += " AND hora = ?";
    queryParams.push(hora);
  }

  if (estado) {
    query += " AND estado = ?";
    queryParams.push(estado);
  }

  sql.query(query, queryParams, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("reservas filtradas: ", res);
    result(null, res);
  });
};

module.exports = Reserva;

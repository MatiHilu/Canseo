const sql = require("./db.js");
const bcrypt = require("bcrypt");

const Paseador = function (paseador) {
  this.nombre = paseador.nombre;
  this.apellido = paseador.apellido;
  this.email = paseador.email;
  this.telefono = paseador.telefono;
  this.direccion = paseador.direccion;
  this.descripcion = paseador.descripcion;
  this.password = paseador.password;
  this.id_barrio = paseador.id_barrio;
  this.foto_perfil = paseador.foto_perfil || null;
};

Paseador.create = (newPaseador, dias_Disponibles, result) => {
  const diasDisponibles = dias_Disponibles || []; // Obtener los días disponibles del objeto newPaseador
  delete newPaseador.dias_disponibles; // Eliminar el campo "dias_disponibles" del objeto newPaseador
  console.log(diasDisponibles.length)

  sql.query("INSERT INTO Paseadores SET ?", newPaseador, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created paseador: ", {
      id: res.insertId,
      ...newPaseador
    });
    const paseadorId = res.insertId;

    if (diasDisponibles.length === 1) {
      // Solo insertar un día disponible
      const primerDia = diasDisponibles[0];

      // Insertar el día disponible en la base de datos
      const query = "INSERT INTO dias_disponibles (id_paseador, dia_semana) VALUES (?, ?)";
      const params = [paseadorId, primerDia];

      sql.query(query, params, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
        } else {
          console.log("Dia disponible insertado con éxito");
          result(null, {
            id: paseadorId,
            ...newPaseador
          });
        }
      });
    } else if (diasDisponibles.length > 1) {

      const insertPromises = diasDisponibles.map((dia) => {
        return new Promise((resolve, reject) => {
          const query = "INSERT INTO dias_disponibles (id_paseador, dia_semana) VALUES (?, ?)";
          const params = [paseadorId, dia];

          sql.query(query, params, (err, res) => {
            if (err) {
              console.log("error: ", err);
              reject(err);
            } else {
              resolve(res);
            }
          });
        });
      });

      // Ejecutar las inserciones de los días disponibles en paralelo
      Promise.all(insertPromises)
        .then(() => {
          const diasCreados = diasDisponibles.map((dia) => ({
            id_paseador: paseadorId,
            dia_semana: dia,
          }));
          console.log("created dias disponibles: ", diasCreados);
          result(null, {
            id: paseadorId,
            ...newPaseador
          });
        })
        .catch((err) => {
          console.log("error: ", err);
          result(err, null);
        });
    } else {
      console.log("No hay días disponibles para insertar");
      result(null, {
        id: paseadorId,
        ...newPaseador
      });
    }
  });
};

Paseador.findById = (id, result) => {
  sql.query(
    `SELECT p.*, b.nombre AS nombre_barrio, GROUP_CONCAT(diadis.dia_semana) AS dias_disponibles
  FROM Paseadores AS p
  INNER JOIN Barrios AS b ON p.id_barrio = b.id
  LEFT JOIN dias_disponibles AS diadis ON p.id = diadis.id_paseador
  WHERE p.id = ${id}
  GROUP BY p.id`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        // Convertir la lista de días disponibles en un array
        const diasDisponibles = res[0].dias_disponibles ? res[0].dias_disponibles.split(',') : [];

        // Eliminar el campo "dias_disponibles" del resultado original
        delete res[0].dias_disponibles;

        // Agregar el campo "dias_disponibles" al resultado
        res[0].dias_disponibles = diasDisponibles;

        result(null, res[0]);
        return;
      }

      result({
        kind: "not_found"
      }, null);
    }
  );
};


Paseador.getAll = (result) => {
  sql.query("SELECT * FROM Paseadores", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("paseadores: ", res);
    result(null, res);
  });
};

Paseador.getByBarrio = (clienteId, diaSemana, fecha, hora, result) => {
  sql.query(
    `SELECT Paseadores.*
  FROM Clientes
  JOIN Paseadores ON Clientes.id_barrio = Paseadores.id_barrio
  WHERE Clientes.id = ? AND Paseadores.id IN (
      SELECT DISTINCT id_paseador
      FROM dias_disponibles
      WHERE dia_semana = ?
  ) AND Paseadores.id NOT IN (
      SELECT id_paseador
      FROM Reservas
      WHERE fecha = ? AND hora = ?
      GROUP BY id_paseador
      HAVING COUNT(*) >= 6
  )`,
    [clienteId, diaSemana, fecha, hora],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("paseadores filtrados: ", res);
      result(null, res);
    }
  );
};



Paseador.updateById = (id, paseador, diasDisponibles, result) => {
  const dias_disponibles = diasDisponibles;
  console.log("Foto", paseador.foto_perfil)

  const deleteQuery = "DELETE FROM dias_disponibles WHERE id_paseador = ?";
  const deleteParams = [id];

  sql.query(deleteQuery, deleteParams, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (paseador.foto_perfil !== null) {
      const query = `
    UPDATE Paseadores
    SET nombre = ?,
        apellido = ?,
        email = ?,
        telefono = ?,
        direccion = ?,
        descripcion = ?,
        id_barrio = ?,
        foto_perfil = ?
    WHERE id = ?
  `;

      const params = [
        paseador.nombre,
        paseador.apellido,
        paseador.email,
        paseador.telefono,
        paseador.direccion,
        paseador.descripcion,
        paseador.id_barrio,
        paseador.foto_perfil,
        id,
      ];

      sql.query(query, params, (err, res) => {
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

        const insertPromises = dias_disponibles.map((dia) => {
          return new Promise((resolve, reject) => {
            const query = "INSERT INTO dias_disponibles (id_paseador, dia_semana) VALUES (?, ?)";
            const params = [id, dia];

            sql.query(query, params, (err, res) => {
              if (err) {
                console.log("error: ", err);
                reject(err);
              } else {
                resolve(res);
              }
            });
          });
        });

        // Ejecutar las inserciones de los días disponibles en paralelo
        Promise.all(insertPromises)
          .then(() => {
            const diasCreados = dias_disponibles.map((dia) => ({
              id_paseador: id,
              dia_semana: dia,
            }));
            console.log("created dias disponibles: ", diasCreados);
            result(null, {
              id: id,
              ...paseador
            });
          })
          .catch((err) => {
            console.log("error: ", err);
            result(err, null);
          });
      });
    } else {
      const query = `
    UPDATE Paseadores
    SET nombre = ?,
        apellido = ?,
        email = ?,
        telefono = ?,
        direccion = ?,
        descripcion = ?,
        id_barrio = ?
        
    WHERE id = ?
  `;

      const params = [
        paseador.nombre,
        paseador.apellido,
        paseador.email,
        paseador.telefono,
        paseador.direccion,
        paseador.descripcion,
        paseador.id_barrio,

        id,
      ];

      sql.query(query, params, (err, res) => {
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

        const insertPromises = dias_disponibles.map((dia) => {
          return new Promise((resolve, reject) => {
            const query = "INSERT INTO dias_disponibles (id_paseador, dia_semana) VALUES (?, ?)";
            const params = [id, dia];

            sql.query(query, params, (err, res) => {
              if (err) {
                console.log("error: ", err);
                reject(err);
              } else {
                resolve(res);
              }
            });
          });
        });

        // Ejecutar las inserciones de los días disponibles en paralelo
        Promise.all(insertPromises)
          .then(() => {
            const diasCreados = dias_disponibles.map((dia) => ({
              id_paseador: id,
              dia_semana: dia,
            }));
            console.log("created dias disponibles: ", diasCreados);
          })
          .catch((err) => {
            console.log("error: ", err);
            result(err, null);
          });

        console.log("updated paseador: ", {
          id: id,
          ...paseador
        });
        result(null, {
          id: id,
          ...paseador
        });
      });
    }
  });
};

Paseador.remove = (id, result) => {
  sql.query("DELETE FROM Paseadores WHERE id = ?", id, (err, res) => {
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

    console.log("deleted paseador with id: ", id);
    result(null, res);
  });
};

Paseador.removeAll = (result) => {
  sql.query("DELETE FROM Paseadores", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} paseadores`);
    result(null, res);
  });
};

Paseador.findByEmail = (email, result) => {
  sql.query(`SELECT * FROM Paseadores WHERE email = "${email}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    result(null, null);
  });
};

Paseador.comparePassword = async (password, hash) => {
  try {
    if (!password || !hash) {
      throw new Error('Se requieren los argumentos "password" y "hash"');
    }
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw error;
  }
};

Paseador.changePassword = (id, newPassword, result) => {
  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    const query = `
    UPDATE Paseadores
    SET password = ?
    WHERE id = ?
  `;

    const params = [
      hash, // Guardar el hash de la nueva contraseña
      id,
    ];

    sql.query(query, params, (err, res) => {
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

      console.log("updated cliente's password: ", {
        id: id
      });
      result(null, {
        id: id
      });
    });
  });
};

module.exports = Paseador;

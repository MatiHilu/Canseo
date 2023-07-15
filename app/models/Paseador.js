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

Paseador.create = (newPaseador, result) => {
  sql.query("INSERT INTO Paseadores SET ?", newPaseador, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created paseador: ", { id: res.insertId, ...newPaseador });
    result(null, { id: res.insertId, ...newPaseador });
  });
};

Paseador.findById = (id, result) => {
  sql.query(
    `SELECT p.*, b.nombre AS nombre_barrio
    FROM paseadores AS p
    INNER JOIN barrios AS b ON p.id_barrio = b.id
    WHERE p.id = ${id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        //console.log("found paseador: ", res[0]);
        result(null, res[0]);
        return;
      }

      result({ kind: "not_found" }, null);
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

Paseador.getByBarrio = (clienteId, result) => {
  sql.query(
    `SELECT Paseadores.*
    FROM Clientes
    JOIN Paseadores ON Clientes.id_barrio = Paseadores.id_barrio
    WHERE Clientes.id = ?`,
    [clienteId],
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

Paseador.updateById = (id, paseador, result) => {
  //const { foto_perfil, ...restoPaseador } = paseador;

  console.log("Foto", paseador.foto_perfil)

  if (paseador.foto_perfil !== null){
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
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("updated paseador: ", { id: id, ...paseador });
    result(null, { id: id, ...paseador });
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
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("updated paseador: ", { id: id, ...paseador });
    result(null, { id: id, ...paseador });
  });
  }





};



Paseador.remove = (id, result) => {
  sql.query("DELETE FROM Paseadores WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
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
        result({ kind: "not_found" }, null);
        return;
      }
      
      console.log("updated cliente's password: ", { id: id });
      result(null, { id: id });
    });
  });
};

module.exports = Paseador;

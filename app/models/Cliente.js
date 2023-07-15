const sql = require("./db.js");
const bcrypt = require("bcrypt");

const Cliente = function (cliente) {
  this.nombre = cliente.nombre;
  this.apellido = cliente.apellido;
  this.email = cliente.email;
  this.telefono = cliente.telefono;
  this.direccion = cliente.direccion;
  this.password = cliente.password;
  this.id_barrio = cliente.id_barrio;
  this.nombre_perro = cliente.nombre_perro;
  this.id_raza = cliente.id_raza;
  this.foto_perfil = cliente.foto_perfil || null;
};

Cliente.create = (newCliente, result) => {
  sql.query("INSERT INTO Clientes SET ?", newCliente, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created cliente: ", { id: res.insertId, ...newCliente });
    result(null, { id: res.insertId, ...newCliente });
  });
};

Cliente.findById = (id, result) => {
  sql.query(
    `SELECT c.*, b.nombre AS nombre_barrio, r.nombre AS nombre_raza
    FROM clientes AS c
		INNER JOIN razas AS r ON c.id_raza = r.id
    INNER JOIN barrios AS b ON c.id_barrio = b.id
    WHERE c.id =${id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        //console.log("found cliente: ", res[0]);
        result(null, res[0]);
        return;
      }

      result({ kind: "not_found" }, null);
    }
  );
};


Cliente.findByEmail = (email, result) => {
  sql.query(`SELECT * FROM Clientes WHERE email = "${email}"`, (err, res) => {
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

Cliente.getAll = result => {
  sql.query("SELECT * FROM Clientes", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("clientes: ", res);
    result(null, res);
  });
};

Cliente.updateById = (id, cliente, result) => {

  console.log("Foto", cliente.foto_perfil)

  if (cliente.foto_perfil !== null){
    const query = `
    UPDATE Clientes
    SET nombre = ?, 
    apellido = ?, 
    email = ?, 
    telefono = ?, 
    direccion = ?, 
    id_barrio = ?, 
    nombre_perro = ?, 
    id_raza = ? ,
    foto_perfil = ?
    
    WHERE id = ?
    `;

    const params = [
      cliente.nombre, 
      cliente.apellido, 
      cliente.email, 
      cliente.telefono, 
      cliente.direccion,  
      cliente.id_barrio, 
      cliente.nombre_perro, 
      cliente.id_raza, 
      cliente.foto_perfil,
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

    console.log("updated cliente: ", { id: id, ...cliente });
    result(null, { id: id, ...cliente });
  });


  } else {
    const query = `
    UPDATE Clientes
    SET nombre = ?, 
    apellido = ?, 
    email = ?, 
    telefono = ?, 
    direccion = ?, 
    id_barrio = ?, 
    nombre_perro = ?, 
    id_raza = ? 
    
    WHERE id = ?
    `;

    const params = [
      cliente.nombre, 
      cliente.apellido, 
      cliente.email, 
      cliente.telefono, 
      cliente.direccion,  
      cliente.id_barrio, 
      cliente.nombre_perro, 
      cliente.id_raza, 
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

    console.log("updated cliente: ", { id: id, ...cliente });
    result(null, { id: id, ...cliente });
  });
  }





};


Cliente.remove = (id, result) => {
  sql.query("DELETE FROM Clientes WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted cliente with id: ", id);
    result(null, res);
  });
};

Cliente.removeAll = result => {
  sql.query("DELETE FROM Clientes", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} clientes`);
    result(null, res);
  });
};

Cliente.comparePassword = async (password, hash) => {
  try {
    if (!password || !hash) {
      throw new Error('Se requieren los argumentos "password" y "hash"');
    }
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw error;
  }
};

Cliente.changePassword = (id, newPassword, result) => {
  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    
    const query = `
      UPDATE Clientes
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


module.exports = Cliente;

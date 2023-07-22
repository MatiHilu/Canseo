const Cliente = require("../models/Cliente");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const upload = require("../middlewares/upload");

exports.register = (req, res) => {
  // Validar la solicitud
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  // Verificar si el email ya está registrado
  Cliente.findByEmail(req.body.email, async (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al verificar el email."
      });
      return;
    }

    if (data) {
      res.status(400).send({
        message: "El email ya está registrado."
      });
      return;
    }
    let fotoPerfil = req.file ? req.file.path : null;
    try {
      // Obtener la ruta temporal del archivo de imagen
      
      

      // Crear un Cliente
      const cliente = new Cliente({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        password: await bcrypt.hash(req.body.password, 10), // Hash de la contraseña
        id_barrio: req.body.id_barrio,
        nombre_perro: req.body.nombre_perro,
        id_raza: req.body.id_raza,
        foto_perfil: fotoPerfil // Ruta del archivo de imagen de perfil
      });

      // Guardar el Cliente en la base de datos
      Cliente.create(cliente, (err, data) => {
        if (err) {
          // Eliminar la imagen de perfil si ocurre un error al guardar en la base de datos
          if (fotoPerfil) {
            fs.unlinkSync(fotoPerfil);
          }
          res.status(500).send({
            message: err.message || "Ocurrió un error al crear el Cliente."
          });
        } else {
          res.send(data);
        }
      });
    } catch (error) {
      // Eliminar la imagen de perfil si ocurre un error
      console.log(error)
      if (fotoPerfil) {
        fs.unlinkSync(fotoPerfil);
      }
      res.status(500).send({
        message: "Ocurrió un error al subir la imagen de perfil."
      });
    }
  });
};

// Autenticación de cliente
exports.login = (req, res) => {
  // Validar la solicitud
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  // Buscar el Cliente por su email
  Cliente.findByEmail(req.body.email, async (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al buscar el Cliente."
      });
      return;
    }

    if (!data) {
      res.status(401).send({
        message: "El email o la contraseña son incorrectos."
      });
      return;
    }
    
 
    // Verificar la contraseña
    const passwordMatch = await Cliente.comparePassword(req.body.password, data.password);
    if (!passwordMatch) {
      res.status(401).send({
        message: "error passwmatch El email o la contraseña son incorrectos."
      });
      return;
    }

    // Generar el token de autenticación
    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, {
      expiresIn: "72h"
    });

    res.send({ token, clientId: data.id });
  });
};

// Obtener todos los Clientes de la base de datos
exports.findAll = (req, res) => {
  Cliente.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ocurrió un error al recuperar los Clientes."
      });
    else res.send(data);
  });
};

// Encontrar un solo Cliente por su Id
exports.findOne = (req, res) => {
  Cliente.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró el Cliente con el id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error al recuperar el Cliente con el id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validar la solicitud
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  console.log("imagen", req.file)
  
  try {  
    const cliente = new Cliente({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
      id_barrio: req.body.id_barrio,
      nombre_perro: req.body.nombre_perro,
      id_raza: req.body.id_raza,
      foto_perfil: req.file && req.file.path !== null ? req.file.path : undefined
    // Nombre del archivo de imagen de perfil o mantener el mismo si no se subió uno nuevo
    });

    Cliente.updateById(req.params.clienteId, cliente, (err, data) => {
      if (err) {
          res.status(500).send({
            message: err.message || "Ocurrió un error al editar el Cliente."
          });
      } else {
        res.send(data);
      }
    }); 
  } catch (error) {
    res.status(500).send({
      message: "Ocurrió un error al subir la imagen de perfil. " + error
    });
  }
};

// Eliminar un Cliente con el id especificado en la solicitud
exports.delete = (req, res) => {
  Cliente.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró el Cliente con el id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "No se pudo eliminar el Cliente con el id " + req.params.id
        });
      }
    } else res.send({ message: `¡El Cliente se eliminó correctamente!` });
  });
};

// Eliminar todos los Clientes de la base de datos.
exports.deleteAll = (req, res) => {
  Cliente.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ocurrió un error al eliminar todos los Clientes."
      });
    else res.send({ message: `¡Todos los Clientes se eliminaron correctamente!` });
  });
};

// Cambiar la contraseña de un cliente
exports.changePassword = (req, res) => {
  // Validar la solicitud
  if (!req.body || !req.body.newPassword || !req.body.confirmPassword) {
    res.status(400).send({
      message: "¡La solicitud debe contener la nueva contraseña y su confirmación!"
    });
    return;
  }

  // Verificar si las contraseñas coinciden
  if (req.body.newPassword !== req.body.confirmPassword) {
    res.status(400).send({
      message: "¡La nueva contraseña y su confirmación no coinciden!"
    });
    return;
  }

  // Buscar el Cliente por su id
  Cliente.findById(req.params.id, async (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al buscar el Cliente."
      });
      return;
    }

    if (!data) {
      res.status(404).send({
        message: "No se encontró el Cliente con el id especificado."
      });
      return;
    }

    try {
      // Verificar si la contraseña actual coincide
      const passwordMatch = await Cliente.comparePassword(req.body.currentPassword, data.password);
      if (!passwordMatch) {
        res.status(401).send({
          message: "La contraseña actual es incorrecta."
        });
        return;
      }

      // Cambiar la contraseña
      Cliente.changePassword(req.params.id, req.body.newPassword, (err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message || "Ocurrió un error al cambiar la contraseña."
          });
          return;
        }

        res.send({ message: "¡La contraseña se cambió correctamente!" });
      });
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error al comparar las contraseñas."
      });
    }
  });
};
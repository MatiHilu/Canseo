const Paseador = require("../models/Paseador");
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
  Paseador.findByEmail(req.body.email, async (err, data) => {
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

    try {
      // Obtener la ruta temporal del archivo de imagen
      const fotoPerfil = req.file ? req.file.path : null;

      // Crear un Paseador
      const paseador = new Paseador({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        descripcion: req.body.descripcion,
        password: await bcrypt.hash(req.body.password, 10), // Hash de la contraseña
        id_barrio: req.body.id_barrio,
        foto_perfil: fotoPerfil // Ruta del archivo de imagen de perfil
      });

      console.log(fotoPerfil)

      // Obtener los días disponibles del cuerpo de la solicitud

      let dias_Disponibles;

      if (Array.isArray(req.body.dias_disponibles)) {
        dias_Disponibles = req.body.dias_disponibles || [];
      } else {
        dias_Disponibles = [req.body.dias_disponibles] || [];
      }

      // Guardar el Paseador en la base de datos con los días disponibles
      Paseador.create(paseador, dias_Disponibles, (err, data) => {
        if (err) {
          // Eliminar la imagen de perfil si ocurre un error al guardar en la base de datos
          if (fotoPerfil) {
            fs.unlinkSync(fotoPerfil);
          }
          res.status(500).send({
            message: err.message || "Ocurrió un error al crear el Paseador."
          });
        } else {
          res.send(data);
        }
      });
    } catch (error) {
      // Eliminar la imagen de perfil si ocurre un error
      if (fotoPerfil) {
        fs.unlinkSync(fotoPerfil);
      }
      res.status(500).send({
        message: "Ocurrió un error al subir la imagen de perfil."
      });
    }
  });
};

// Autenticación de paseador
exports.login = (req, res) => {
  // Validar la solicitud
  if (!req.body) {
    res.status(400).send({
      message: "¡El contenido no puede estar vacío!"
    });
    return;
  }

  // Buscar el Paseador por su email
  Paseador.findByEmail(req.body.email, async (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al buscar el Paseador."
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
    const passwordMatch = await Paseador.comparePassword(req.body.password, data.password);
    if (!passwordMatch) {
      res.status(401).send({
        message: "error passwmatch El email o la contraseña son incorrectos."
      });
      return;
    }

    // Generar el token de autenticación
    const token = jwt.sign({
      id: data.id
    }, process.env.JWT_SECRET, {
      expiresIn: "72h"
    });

    res.send({
      token,
      clientId: data.id
    });
  });
};


// Obtener todos los Paseadores de la base de datos
exports.findAll = (req, res) => {
  Paseador.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los Paseadores."
      });
    else res.send(data);
  });
};

// Encontrar paseadores por ID de barrio + día disponible
exports.findByBarrio = (req, res) => {
  const clienteId = req.params.clienteId;
  const diaSemanaObject = JSON.parse(req.query.dia_semana);
  const diaSemana = diaSemanaObject.dia_semana;
  const fecha = diaSemanaObject.fecha;
  const hora = diaSemanaObject.hora;

  Paseador.getByBarrio(clienteId, diaSemana, fecha, hora, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al buscar los paseadores por ID de barrio."
      });
    } else {
      res.send(data);
    }
  });
};

// Encontrar un solo Paseador por su Id
exports.findOne = (req, res) => {
  Paseador.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró el Paseador con el id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error al recuperar el Paseador con el id " + req.params.id
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



  try {
    const paseador = new Paseador({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
      descripcion: req.body.descripcion,
      id_barrio: req.body.id_barrio,
      foto_perfil: req.file && req.file.path !== null ? req.file.path : undefined
      // Nombre del archivo de imagen de perfil o mantener el mismo si no se subió uno nuevo
    });

    const diasDisponibles = req.body.dias_disponibles || [];

    Paseador.updateById(req.params.paseadorId, paseador, diasDisponibles, (err, data) => {
      if (err) {
        console.log("Ocurrió un error al subir la imagen de perfil. ", err);
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



// Eliminar un Paseador con el id especificado en la solicitud
exports.delete = (req, res) => {
  Paseador.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No se encontró el Paseador con el id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "No se pudo eliminar el Paseador con el id " + req.params.id
        });
      }
    } else res.send({
      message: `¡El Paseador se eliminó correctamente!`
    });
  });
};

// Eliminar todos los Paseadores de la base de datos.
exports.deleteAll = (req, res) => {
  Paseador.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todos los Paseadores."
      });
    else res.send({
      message: `¡Todos los Paseadores se eliminaron correctamente!`
    });
  });
};

// Cambiar la contraseña de un paseador
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

  // Buscar el Paseador por su id
  Paseador.findById(req.params.id, async (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al buscar el Paseador."
      });
      return;
    }

    if (!data) {
      res.status(404).send({
        message: "No se encontró el Paseador con el id especificado."
      });
      return;
    }

    try {
      // Verificar si la contraseña actual coincide
      const passwordMatch = await Paseador.comparePassword(req.body.currentPassword, data.password);
      if (!passwordMatch) {
        res.status(401).send({
          message: "La contraseña actual es incorrecta."
        });
        return;
      }

      // Cambiar la contraseña
      Paseador.changePassword(req.params.id, req.body.newPassword, (err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message || "Ocurrió un error al cambiar la contraseña."
          });
          return;
        }

        res.send({
          message: "¡La contraseña se cambió correctamente!"
        });
      });
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error al comparar las contraseñas."
      });
    }
  });
};
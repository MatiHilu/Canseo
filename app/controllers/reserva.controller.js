const Reserva = require("../models/Reserva");

exports.create = (req, res) => {
  // Validar la solicitud
  if (!req.body) {
    return res.status(400).json({
      message: "¡El contenido no puede estar vacío!",
    });
  }

  // Crear una Reserva
  const reserva = new Reserva({
    id_paseador: req.body.id_paseador,
    id_cliente: req.body.id_cliente,
    fecha: req.body.fecha,
    hora: req.body.hora,
  });

  // Validar restricciones
  const currentDate = new Date();
  const selectedDate = new Date(reserva.fecha);

  if (selectedDate < currentDate) {
    // Selected date has already passed
    return res.status(400).json({
      message: "No se pueden hacer reservas en fechas pasadas.",
    });
  }

  // Extract the hour from the selected time
  const selectedHour = parseInt(reserva.hora.split(":")[0]);

  if (selectedHour < 7 || selectedHour > 20) {
    // Selected hour is outside the allowed range
    return res.status(400).json({
      message: "Solo se permiten reservas entre las 7:00 y las 20:00.",
    });
  }

  Reserva.countReservations(
    reserva.id_paseador,
    reserva.fecha,
    reserva.hora,
    (err, count) => {
      if (err) {
        return res.status(500).json({
          message: "Ocurrió un error al verificar las reservas existentes.",
        });
      }

      if (count >= 6) {
        // The Paseador already has 6 reservations on the same date and time
        return res.status(400).json({
          message: "El paseador ya tiene 6 reservas para la misma fecha y hora.",
        });
      }

      // Guardar la Reserva en la base de datos
      Reserva.create(reserva, (err, data) => {
        if (err) {
          return res.status(500).json({
            message:
              err.message || "Ocurrió un error al crear la Reserva.",
          });
        }
        return res.status(201).json(data);
      });
    }
  );
};

exports.findAll = (req, res) => {
  Reserva.getAll((err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message || "Ocurrió un error al recuperar las Reservas.",
      });
    }
    return res.send(data);
  });
};

exports.getReservasByUserId = (req, res) => {
  const id_cliente = req.params.id_cliente;
  Reserva.getReservasByUserId(id_cliente, (err, data) => {
    if (err) {
      return res.status(500).json({
        message:
          err.message || "Ocurrió un error al recuperar las Reservas del usuario.",
      });
    }
    return res.send(data);
  });
};

exports.getReservasByPaseadorId = (req, res) => {
  const id_paseador = req.params.id_paseador;
  Reserva.getReservasByPaseadorId(id_paseador, (err, data) => {
    if (err) {
      return res.status(500).json({
        message:
          err.message || "Ocurrió un error al recuperar las Reservas del paseador.",
      });
    }
    return res.send(data);
  });
};


exports.updateEstado = (req, res) => {
  // Validar la solicitud
  if (!req.body.estado) {
    return res.status(400).json({
      message: "El estado de la reserva es requerido.",
    });
  }

  const estado = req.body.estado;
  console.log(estado, req.params.reservaId)
  Reserva.updateEstadoById(req.params.reservaId, estado, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          message: `No se encontró la reserva con el ID ${req.params.reservaId}.`,
        });
      } else {
        res.status(500).json({
          message: `Error al actualizar el estado de la reserva con el ID ${req.params.reservaId}.`,
        });
      }
    } else {
      res.json(data);
    }
  });
};


exports.delete = (req, res) => {
  Reserva.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `No se encontró la Reserva con el id ${req.params.id}.`,
        });
      } else {
        return res.status(500).json({
          message:
            "No se pudo eliminar la Reserva con el id " + req.params.id,
        });
      }
    }
    return res.send({ message: `¡La Reserva se eliminó correctamente!` });
  });
};

exports.deleteAll = (req, res) => {
  Reserva.removeAll((err, data) => {
    if (err) {
      return res.status(500).json({
        message:
          err.message || "Ocurrió un error al eliminar todas las Reservas.",
      });
    }
    return res.send({
      message: `¡Todas las Reservas se eliminaron correctamente!`,
    });
  });
};

exports.getReservasFiltradas = (req, res) => {
  const clienteId = req.params.id_cliente;
  const { fecha, hora, estado } = req.query;
  console.log(fecha)
  console.log(clienteId)

  Reserva.getReservasFiltradas(clienteId, fecha, hora, estado, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al buscar las reservas filtradas.",
      });
    } else {
      res.send(data);
    }
  });
};

exports.getReservasFiltradasPaseador = (req, res) => {
  const clienteId = req.params.id_paseador;
  const { fecha, hora, estado } = req.query;
  console.log(fecha)
  console.log(clienteId)

  Reserva.getReservasFiltradasPaseador(clienteId, fecha, hora, estado, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Ocurrió un error al buscar las reservas filtradas.",
      });
    } else {
      res.send(data);
    }
  });
};
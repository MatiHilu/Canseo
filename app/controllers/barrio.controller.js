const Barrio = require("../models/Barrio");

// Controlador para obtener todos los barrios
exports.getAllBarrios = (req, res) => {
  Barrio.getAll((err, data) => {
    if (err) {
      res.status(500).json({
        message: err.message || "Ocurrió un error al obtener los barrios.",
      });
    } else {
      res.json(data);
    }
  });
};

// Controlador para obtener un barrio por su ID
exports.getBarrioById = (req, res) => {
  Barrio.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          message: `No se encontró el barrio con el ID ${req.params.id}.`,
        });
      } else {
        res.status(500).json({
          message: `Ocurrió un error al obtener el barrio con el ID ${req.params.id}.`,
        });
      }
    } else {
      res.json(data);
    }
  });
};
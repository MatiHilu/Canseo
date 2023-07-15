const Raza = require("../models/Raza");

// Controlador para obtener todos los razas
exports.getAllRazas = (req, res) => {
  Raza.getAll((err, data) => {
    if (err) {
      res.status(500).json({
        message: err.message || "Ocurrió un error al obtener los razas.",
      });
    } else {
      res.json(data);
    }
  });
};

// Controlador para obtener un raza por su ID
exports.getRazaById = (req, res) => {
  Raza.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          message: `No se encontró el raza con el ID ${req.params.id}.`,
        });
      } else {
        res.status(500).json({
          message: `Ocurrió un error al obtener el raza con el ID ${req.params.id}.`,
        });
      }
    } else {
      res.json(data);
    }
  });
};
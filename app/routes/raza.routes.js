const express = require("express");
const router = express.Router();
const razasController = require("../controllers/raza.controller");

// Ruta para obtener todos los razas
router.get("/", razasController.getAllRazas);

// Ruta para obtener un razas por su ID
router.get("/:id", razasController.getRazaById);

module.exports = router;
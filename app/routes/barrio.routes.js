const express = require("express");
const router = express.Router();
const barriosController = require("../controllers/barrio.controller");

// Ruta para obtener todos los barrios
router.get("/", barriosController.getAllBarrios);

// Ruta para obtener un barrio por su ID
router.get("/:id", barriosController.getBarrioById);

module.exports = router;
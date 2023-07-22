const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reserva.controller");
const { authenticate } = require("../middlewares/authentication");

// Crear una nueva Reserva
router.post("/", authenticate, reservaController.create);

// Obtener todas las Reservas
router.get("/", authenticate, reservaController.findAll);

// Obtener las Reservas por ID de Usuario
router.get("/user/:id_cliente", authenticate, reservaController.getReservasByUserId);

// Obtener las Reservas por ID de Paseador
router.get("/paseador/:id_paseador", authenticate, reservaController.getReservasByPaseadorId);

// Obtener reservas filtradas por cliente, fecha, hora y estado
router.get("/filtered/:id_cliente", authenticate, reservaController.getReservasFiltradas);

// Obtener reservas filtradas por cliente, fecha, hora y estado
router.get("/filteredPaseador/:id_paseador", authenticate, reservaController.getReservasFiltradasPaseador);

// Actualizar el estado de una Reserva por su Id
router.patch("/:reservaId/estado", authenticate, reservaController.updateEstado);

// Eliminar una Reserva por su Id
router.delete("/:id", authenticate, reservaController.delete);

// Eliminar todas las Reservas
router.delete("/", authenticate, reservaController.deleteAll);

module.exports = router;

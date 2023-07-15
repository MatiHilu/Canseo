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

// Obtener las Reservas Pendientes
router.get("/pendientes", authenticate, reservaController.getReservasPendientes);

// Obtener las Reservas Realizadas
router.get("/realizadas", authenticate, reservaController.getReservasRealizadas);

// Actualizar el estado de una Reserva por su Id
router.patch("/:reservaId/estado", authenticate, reservaController.updateEstado);

// Actualizar una Reserva por su Id
//router.put("/:id", authenticate, reservaController.update);

// Eliminar una Reserva por su Id
router.delete("/:id", authenticate, reservaController.delete);

// Eliminar todas las Reservas
router.delete("/", authenticate, reservaController.deleteAll);

module.exports = router;

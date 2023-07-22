const express = require("express");
const router = express.Router();
const paseadorController = require("../controllers/paseador.controller");
const { authenticate } = require("../middlewares/authentication");
const upload = require("../middlewares/upload");

// Registro de un nuevo Paseador
router.post("/register", upload.single("foto_perfil"), paseadorController.register); // Usar el middleware de carga de archivos

// Autenticación de Paseador
router.post("/login", paseadorController.login);

// Obtener todos los Paseadores
router.get("/", authenticate, paseadorController.findAll);

// Obtener todos los Paseadores por barrio dependiendo del cliente y su barrio
router.get("/by-barrio/:clienteId", authenticate, paseadorController.findByBarrio);

// Obtener un solo Paseador por su Id
router.get("/:id", authenticate, paseadorController.findOne);

// Actualizar un Paseador por su Id
router.put("/:paseadorId", upload.single("foto_perfil"), authenticate, paseadorController.update);

// Cambiar la contraseña de un Cliente
router.put("/:id/change-password", authenticate, paseadorController.changePassword);

// Eliminar un Paseador por su Id
router.delete("/:id", authenticate, paseadorController.delete);

// Eliminar todos los Paseadores
router.delete("/", authenticate, paseadorController.deleteAll);

module.exports = router;

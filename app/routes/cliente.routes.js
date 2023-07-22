const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/cliente.controller");
const { authenticate } = require("../middlewares/authentication");
const upload = require("../middlewares/upload");

// Registro de un nuevo Cliente
router.post("/register", upload.single("foto_perfil"), clienteController.register);

// Autenticación de Cliente
router.post("/login", clienteController.login);

// Obtener todos los Clientes
router.get("/", authenticate, clienteController.findAll);

// Obtener un solo Cliente por su Id
router.get("/:id", authenticate, clienteController.findOne);

// Actualizar un Cliente por su Id
router.put("/:clienteId", upload.single("foto_perfil"), authenticate, clienteController.update);

// Cambiar la contraseña de un Cliente
router.put("/:id/change-password", authenticate, clienteController.changePassword);

// Eliminar un Cliente por su Id
router.delete("/:id", authenticate, clienteController.delete);

// Eliminar todos los Clientes
router.delete("/", authenticate, clienteController.deleteAll);

module.exports = router;

require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to your project." });
});

// Rutas para Paseadores
const paseadorRoutes = require("./app/routes/paseador.routes");
app.use("/api/paseadores", paseadorRoutes);

// Rutas para Clientes
const clienteRoutes = require("./app/routes/cliente.routes");
app.use("/api/clientes", clienteRoutes);

// Rutas para Reservas
const reservaRoutes = require("./app/routes/reserva.routes");
app.use("/api/reservas", reservaRoutes);

// Rutas para Reservas
const barrioRoutes = require("./app/routes/barrio.routes");
app.use("/api/barrios", barrioRoutes);

// Rutas para Razas
const razaRoutes = require("./app/routes/raza.routes");
app.use("/api/razas", razaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

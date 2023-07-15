const jwt = require("jsonwebtoken");

// Middleware de autenticación
exports.authenticate = (req, res, next) => {
  try {
    // Obtener el token de autenticación del encabezado de la solicitud
    const token = req.headers.authorization.split(" ")[1];
    
    // Verificar el token utilizando la clave secreta (puede ser una cadena aleatoria)
    //const decodedToken = jwt.verify(token, "clave_secreta");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar el ID del usuario autenticado a la solicitud para uso posterior
    req.userId = decodedToken.userId;

    // Continuar con la siguiente función de middleware
    next();
  } catch (error) {
    res.status(401).json({ message: "Autenticación fallida" });
  }
};

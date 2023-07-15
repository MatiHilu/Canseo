const multer = require("multer");

// Configuración del almacenamiento y nombre del archivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "vue/public/uploads/perfil"); // Ruta relativa al directorio raíz del proyecto
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop(); // Obtiene la extensión del archivo original
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension); // Agrega la extensión al nombre del archivo
  },
});

// Filtro para permitir solo archivos de imagen
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Formato de archivo no válido. Se permiten solo imágenes."), false);
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Tamaño máximo del archivo: 5MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;

// utils/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuración del almacenamiento dinámico
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Carpeta base
        const basePath = path.join(process.cwd(), "wwwroot", "Uploads");

        // Lógica para subcarpeta dinámica según el tipo MIME
        let subFolder = "otros"; // valor por defecto
        if (file.mimetype.startsWith("image/")) {
            subFolder = "imagenes";
        } else if (file.mimetype === "application/pdf") {
            subFolder = "pdfs";
        } else if (file.mimetype.startsWith("text/")) {
            subFolder = "textos";
        } else if (file.mimetype === "application/pdf") {
            subFolder = "pdfs";
        } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            subFolder = "temp";
        } else if (file.mimetype === "application/vnd.ms-excel") {
            subFolder = "temp";
        }

        const uploadPath = path.join(basePath, subFolder);

        // Crear el directorio si no existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Nombre único: timestamp + aleatorio + extensión original
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Inicializar multer con la configuración
const upload = multer({ storage });

module.exports = upload;
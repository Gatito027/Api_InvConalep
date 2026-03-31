const express = require('express');
const app = express();
const http = require('http');
const port = 3000;
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const cspConfig = require('./Config/cspConfig');
const { initSocket } = require('./Config/socket'); 
const mainRoutes = require('./Routers/Main.Routes');
const dataFormsRoutes = require('./Routers/DataForms.Routes');
const rolesRoutes = require('./Routers/Roles.Routes');
const inventarioRoutes = require('./Routers/Articulos.Routes');
const dotenv = require('dotenv');
dotenv.config();

//* Configuración de CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('El origen CORS no está permitido.'), false);
    },
    credentials: true,
};

app.use(cors(corsOptions));

//* Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//* Seguridad
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
    frameguard: false,
}));
app.use(cspConfig);

//* Configuración de archivos
const uploadDir = path.join(__dirname, 'wwwroot', 'Uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//* Rutas
app.use('/', mainRoutes);
app.use('/data', dataFormsRoutes);
app.use('/roles', rolesRoutes);
app.use('/inv', inventarioRoutes);

app.use('/Uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    next();
}, express.static(uploadDir, {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
    index: false,
    maxAge: '1d',
    redirect: false,
}));

app.get('/', (req, res) => {
    res.send('¡Hola, mundo desde Express!');
});

const server = http.createServer(app);

// Inicializar socket con el server
initSocket(server, allowedOrigins); // ← reemplaza el bloque anterior de io

//* Iniciar servidor
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
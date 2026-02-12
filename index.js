const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cspConfig = require('./Config/cspConfig');
const mainRoutes = require('./Routers/Main.Routes');
const dataFormsRoutes = require('./Routers/DataForms.Routes');
const dotenv = require('dotenv');
dotenv.config();

//* Configuración de CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = 'El origen CORS no está permitido.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

//* Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//* Seguridad
app.use(helmet());
app.use(cspConfig);

//* Rutas principales
app.use('/', mainRoutes);

app.use('/data', dataFormsRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express!');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

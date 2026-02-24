const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Crear carpeta "logs" si no existe
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Nombre de archivo dinámico por fecha (YYYY-MM-DD.log)
const logFileName = path.join(logDir, `${new Date().toISOString().slice(0,10)}.log`);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFileName })
  ]
});

// En desarrollo, logs más simples en consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
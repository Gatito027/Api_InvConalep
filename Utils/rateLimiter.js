const rateLimit = require('express-rate-limit');
const ResponseDto = require('../Models/Dto/ResponseDto'); 

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos
    handler: (req, res) => {
        const response = new ResponseDto(
            false,
            'Demasiados intentos de login, intenta más tarde',
            null
        );
        res.status(429).json(response); // 429 Too Many Requests
    },
});

module.exports = loginLimiter;

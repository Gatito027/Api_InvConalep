const db = require('../Config/database');
const logger = require('../Utils/logger');
const bcrypt = require('bcryptjs');
const ResponseDto = require('../Models/Dto/ResponseDto');
const JwtTokenGenerator = require('../Utils/JwtTokenGenerator');
const jwtGenerator = new JwtTokenGenerator();

require('dotenv').config();

const login = async (req, res) => {
    logger.info('Iniciando proceso de login');
    const response = new ResponseDto();

    try {
        const { _usuario, _password } = req.body;

        // Buscar usuario
        const result = await db.oneOrNone(
            'SELECT * FROM public.usuarios AS u WHERE u.nombreusuario = $1',
            [_usuario]
        );

        if (!result) {
            logger.info(`Usuario ${_usuario} no encontrado`);
            response.isSuccess = false;
            response.message = "Usuario no encontrado";
            response.data = null;
            return res.status(404).json(response);
        }

        // Validar contraseña
        const passwordMatch = await bcrypt.compare(_password, result.contrasena);
        if (!passwordMatch) {
            logger.info(`Contraseña incorrecta para usuario ${_usuario}`);
            response.isSuccess = false;
            response.message = "Credenciales inválidas";
            response.data = null;
            return res.status(401).json(response);
        }

        // Obtener datos adicionales
        const data = await db.one(
            'SELECT * FROM public.obtener_usuarios_con_permisos($1)',
            [_usuario]
        );

        // Generar token
        const token = jwtGenerator.generateToken(data);

        logger.info(`El usuario ${_usuario} inició sesión correctamente`);
        response.isSuccess = true;
        response.message = "Login exitoso";
        response.data = data;

        // Primero setear cookie, luego enviar respuesta
        res.cookie('token', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true
        });

        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Error al iniciar sesión: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno al iniciar sesión";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { login };
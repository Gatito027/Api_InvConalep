const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const profile = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        logger.info('Iniciando validación de token en profile');

        const validar = AuthenticationExtensions.addJwtAuthentication(token);

        if (!validar.isSuccess) {
            logger.warn('Token inválido detectado');
            response.isSuccess = false;
            response.message = "Error token no válido";
            response.data = null;
            return res.status(401).json(response);
        }

        logger.info(`Token válido, usuario identificado: ${validar.data.usuario}`);

        if (!validar.data.usuario) {
            logger.warn('Usuario no válido en el token');
            response.isSuccess = false;
            response.message = "Error usuario no válido";
            response.data = null;
            return res.status(403).json(response);
        }

        logger.info(`Consultando permisos del usuario: ${validar.data.usuario}`);

        const data = await db.one(
            'SELECT * FROM public.obtener_usuarios_con_permisos($1)',
            [validar.data.usuario]
        );

        logger.info('Consulta de permisos ejecutada con éxito');

        response.isSuccess = true;
        response.message = "";
        response.data = data;

        logger.info(`Login exitoso para usuario: ${validar.data.usuario}`);
        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Error al iniciar sesión: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno al iniciar sesión";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { profile };

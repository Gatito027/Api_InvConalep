const db = require('../Config/database');
const bcrypt = require('bcryptjs');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const ActualizarPasswordAdmin = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _password, _usuarioId } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Solicitud de cambio de contraseña iniciada por: ${userData?.data?.usuario || 'usuario desconocido'}`);
        const hash_password = await bcrypt.hash(_password, 10);
        const result = await db.one('select * from cambiar_password($1, $2)',[_usuarioId, hash_password]);

        if (result.cambiar_password === "Ok") {
            logger.info(`Contraseña cambiada para el usuario ${_usuarioId}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al cambiar contraseña, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error interno al cambiar la contraseña";
            response.data = null;
            return res.status(500).json(response);
        }
    } catch (error) {
        logger.error(`Error al cambiar contraseña: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error al cambiar la contraseña";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { ActualizarPasswordAdmin };
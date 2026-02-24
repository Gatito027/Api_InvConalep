const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const ActualizarRol = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _rol, _usuarioId } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Solicitud de cambio de cambio de rol iniciada por: ${userData?.data?.usuario || 'usuario desconocido'}`);
        //console.log("Nuevorol", _rol, "/", _usuarioId);
        const result = await db.one('select * from cambiar_rol($1, $2)',[_usuarioId, _rol]);

        if (result.cambiar_rol === "Ok") {
            logger.info(`Rol cambiado para el usuario ${_usuarioId}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al cambiar el rol, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error interno al cambiar el rol";
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

module.exports = {ActualizarRol};
const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const ActualizarArea = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _area, _usuarioId } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Solicitud de cambio de area de trabajo iniciada por: ${userData?.data?.usuario || 'usuario desconocido'}`);
        //console.log("Nuevorol", _rol, "/", _usuarioId);
        const result = await db.one('select * from cambiar_area($1, $2)',[_usuarioId, _area]);

        if (result.cambiar_area === "Ok") {
            logger.info(`Area cambiada para el usuario ${_usuarioId}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al cambiar el area, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error interno al cambiar el area";
            response.data = null;
            return res.status(500).json(response);
        }
    } catch (error) {
        logger.error(`Error al cambiar el area de trabajo: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error al cambiar el area de trabajo";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { ActualizarArea };
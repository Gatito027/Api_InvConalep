const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const EditarUsuario = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _rol, _usuarioId, _area, _nombre, _usuario } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Solicitud de actualizaci[on de usuario iniciada por: ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one('select * from cambiar_datos_usuario($1, $2, $3, $4, $5)',[_usuarioId, _nombre, _usuario, _rol, _area]);

        if (result.cambiar_datos_usuario === "Ok") {
            logger.info(`Datos cambiados para el usuario ${_usuarioId}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al actualizar el usuario, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error interno al cambiar el usuario";
            response.data = null;
            return res.status(500).json(response);
        }

    } catch (error) {
        logger.error(`Error al actualizar el usuario: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error al actualizar el usuario";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = {EditarUsuario};
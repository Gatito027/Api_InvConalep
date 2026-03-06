const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const EditarRol = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _rolId, _nombre, _permisos } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Solicitud de actualización de rol iniciada por: ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one('select * from cambiar_rol($1, $2, $3::int[])',[_rolId, _nombre, _permisos]);

        if (result.cambiar_rol === "Ok") {
            logger.info(`Permisos actualizados`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al editar el rol, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error interno al editar el rol";
            response.data = null;
            return res.status(500).json(response);
        }
    } catch (error) {
        logger.error(`Error al editar el rol: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error al editar el rol";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { EditarRol };
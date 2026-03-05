const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const DeleteRol = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { _rolId } = req.body;
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Eliminacion de rol realizada por ${userData.data.usuario}`);
        const result = await db.one("select * from eliminar_rol($1)", [_rolId]);
        if (result.eliminar_rol === "Ok") {
            logger.info(`Rol eliminado correctamente`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al eliminar un rol, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al eliminar el rol";
            response.data = null;
            return res.status(400).json(response);
        }
    } catch (error) {
        logger.error(`Error al eliminar un rol: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { DeleteRol };
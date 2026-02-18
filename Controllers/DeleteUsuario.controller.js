const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const DeleteUsuario = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { _usuariId } = req.body;
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Eliminacion de usuario realizada por ${userData.data.usuario}`);
        const result = await db.one("select * from eliminar_usuario($1)", [_usuariId]);
        if (result.eliminar_usuario === "Ok") {
            logger.info(`Usuario eliminado correctamente`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al eliminar una cuenta, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al eliminar la cuenta";
            response.data = null;
            return res.status(400).json(response);
        }
    } catch (error) {
        logger.error(`Error al eliminar un usuario: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { DeleteUsuario };
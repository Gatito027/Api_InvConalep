const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const ObtenerUsuario = async (req, res) =>{
    const response = new ResponseDto();
    try {
        const { _usuarioId } = req.body;
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Consulta de usuario realizada por ${userData.data.usuario}`);
        const result = await db.oneOrNone("SELECT * FROM obtener_usuario_por_id($1)", [_usuarioId]);
        if (!result || !result.usuarioid) {
            logger.warn(`Usuario con id ${_usuarioId} no encontrado`);
            response.isSuccess = false;
            response.message = "Este usuario no fue encontrado";
            response.data = null;
            return res.status(404).json(response);
        } else {
            logger.info(`Consulta del usuario ${result.nombreusuario} realizada con éxito`);
            response.isSuccess = true;
            response.message = "";
            response.data = result;
            return res.status(200).json(response);
        }
    } catch (error) {
        logger.error(`Error al obtener un usuario: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = {ObtenerUsuario}
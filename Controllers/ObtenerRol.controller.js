const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const ObtenerRol = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { _rolId } = req.body;
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Consulta de rol realizada por ${userData.data.usuario}`);
        const result = await db.one("select * from obtener_rol_by_id($1) as rol;", [_rolId]);
        //console.log(result.rol);
        if (!result || !result.rol.nombre) {
            logger.warn(`rol con id ${_rolId} no encontrado`);
            response.isSuccess = false;
            response.message = "Este rol no fue encontrado";
            response.data = null;
            return res.status(404).json(response);
        } else {
            logger.info(`Consulta del rol ${result.nombre} realizada con éxito`);
            response.isSuccess = true;
            response.message = "";
            response.data = result;
            return res.status(200).json(response);
        }
    } catch (error) {
        logger.error(`Error al obtener un rol: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { ObtenerRol };
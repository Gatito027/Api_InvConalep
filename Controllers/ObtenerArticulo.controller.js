const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const ObtenerArticulo = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { _ItemId } = req.body;
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Consulta de item realizada por ${userData.data.usuario}`);
        const result = await db.one("select * from obtener_articulos_by_id($1)", [_ItemId]);
        //console.log(result.numeroinventario);
        if (!result || !result.numeroinventario) {
            logger.warn(`Item con id ${_ItemId} no encontrado`);
            response.isSuccess = false;
            response.message = "Este item no fue encontrado";
            response.data = null;
            return res.status(404).json(response);
        } else {
            logger.info(`Consulta del item ${result.numeroinventario} realizada con éxito`);
            response.isSuccess = true;
            response.message = "";
            response.data = result;
            return res.status(200).json(response);
        }
    } catch (error) {
        logger.error(`Error al obtener el item: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { ObtenerArticulo };
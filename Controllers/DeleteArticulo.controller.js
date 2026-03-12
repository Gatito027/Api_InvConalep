const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const DeleteArticulo = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { _ItemId } = req.body;
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Eliminacion de articulo realizada por ${userData.data.usuario}`);
        const result = await db.one("select * from eliminar_articulo($1)", [_ItemId]);
        if (result.eliminar_articulo === "Ok") {
            logger.info(`Articulo eliminado correctamente`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al eliminar un articulo, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al eliminar el item";
            response.data = null;
            return res.status(400).json(response);
        }
    } catch (error) {
        logger.error(`Error al eliminar un articulo: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { DeleteArticulo };
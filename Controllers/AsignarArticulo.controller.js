const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const AsignarArticulo = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _ItemId, _NewPersonaId } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Solicitud de asignacion de articulo iniciada por: ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one('select * from asignar_persona_articulo($1, $2::int[])',[_ItemId, _NewPersonaId]);

        if (result.asignar_persona_articulo === "Ok") {
            logger.info(`Asignado con exito`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al Asignar, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error interno al asignar articulo";
            response.data = null;
            return res.status(500).json(response);
        }
    } catch (error) {
        logger.error(`Error al asignar a un item: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error al asignar";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { AsignarArticulo };
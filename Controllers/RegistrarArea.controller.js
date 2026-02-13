const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const RegistrarArea = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _area } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Registro de un nuevo area realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one("select * from crear_area($1);", [_area]);
        if (result.crear_area === "Ok") {
            logger.info(`Area registrada: ${_area}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al crear una area, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al crear la area";
            response.data = null;
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.error(`Error al registrar un area: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = {RegistrarArea};
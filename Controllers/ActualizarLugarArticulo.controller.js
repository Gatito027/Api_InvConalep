const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const ActualizarLugarArticulo = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _ItemId, _lugarId } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Solicitud de cambio de lugar de un articulo iniciada por: ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one('select * from cambiar_lugar_bienes($1, $2)',[_lugarId, _ItemId]);
        if (result.cambiar_lugar_bienes === "Ok") {
            logger.info(`Lugar cambiado para el articulo ${_ItemId}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al cambiar el lugar del articulo, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error interno";
            response.data = null;
            return res.status(500).json(response);
        }
    } catch (error) {
        logger.error(`Error al actualizar el lugar de un articulo: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error al actualizar el lugar";
        response.data = null;
        return res.status(500).json(response);
    }
};

const RegistrarLugarArticulo = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _ItemId, _lugar } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Solicitud de cambio y registro de lugar de un articulo iniciada por: ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one('select * from cambiar_lugar_registrar_bienes($1, $2)',[_lugar, _ItemId]);
        if (result.cambiar_lugar_registrar_bienes === "Ok") {
            logger.info(`Lugar cambiado para el articulo ${_ItemId}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al cambiar y registrar el lugar del articulo, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error interno";
            response.data = null;
            return res.status(500).json(response);
        }
    } catch (error) {
        logger.error(`Error al actualizar o registrar el lugar de un articulo: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error al registrar el lugar";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { ActualizarLugarArticulo, RegistrarLugarArticulo };
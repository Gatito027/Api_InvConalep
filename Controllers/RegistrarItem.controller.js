const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const RegistrarUbicacion = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _ubicacion } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Registro de un nueva ubicacion realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one("select * from registrar_lugar($1);", [_ubicacion]);
        if (result.registrar_lugar === "Ok") {
            logger.info(`Ubicacion registrada: ${_ubicacion}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al crear la ubicación, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al guardar la ubicacion";
            response.data = null;
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.error(`Error al registrar una ubicacion: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const RegistrarMarca = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _marca } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Registro de una nueva marca realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one("select * from registrar_marca($1);", [_marca]);
        if (result.registrar_marca === "Ok") {
            logger.info(`Marca registrada: ${_marca}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al guardar la marca, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al guardar la marca";
            response.data = null;
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.error(`Error al registrar una marca: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const RegistrarModelo = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _modelo } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Registro de un modelo realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one("select * from registrar_modelo($1);", [_modelo]);
        if (result.registrar_modelo === "Ok") {
            logger.info(`Modelo registrado: ${_modelo}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al guardar el modelo, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al guardar el modelo";
            response.data = null;
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.error(`Error al registrar un modelo: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const RegistrarCuenta = async (req, res) =>{
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _tipo } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Registro de un tipo de bien realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one("select * from registrar_cuenta($1);", [_tipo]);
        if (result.registrar_cuenta === "Ok") {
            logger.info(`Tipo registrado: ${_tipo}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al guardar el tipo, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al guardar el tipo";
            response.data = null;
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.error(`Error al registrar un tipo: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const RegistrarItem = async (req, res) =>{};

module.exports = {RegistrarCuenta, RegistrarMarca, RegistrarUbicacion, RegistrarModelo, RegistrarItem};
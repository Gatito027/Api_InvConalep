const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const ListaMarcas = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("SELECT * FROM public.marcas;");
        logger.info(`Consulta de marcas realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        response.isSuccess = true;
        response.message = "";
        response.data = data;
        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Error al obtener marcas: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const ListaModelos = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("SELECT * FROM public.modelos;");
        logger.info(`Consulta de modelos realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        response.isSuccess = true;
        response.message = "";
        response.data = data;
        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Error al obtener los modelos: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const ListaCuentas = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("SELECT * FROM public.departamentos;");
        logger.info(`Consulta de tipos de bienes realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        response.isSuccess = true;
        response.message = "";
        response.data = data;
        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Error al obtener lostipos de bienes: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};
module.exports = { ListaMarcas, ListaModelos, ListaCuentas };
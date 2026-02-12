const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const ListaRoles = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("SELECT * FROM public.roles;");
        logger.info(`Consulta de roles realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        response.isSuccess = true;
        response.message = "";
        response.data = data;
        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Error al obtener roles: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const ListaAreas = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("SELECT * FROM public.areas;");
        logger.info(`Consulta de áreas realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        response.isSuccess = true;
        response.message = "";
        response.data = data;
        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Error al obtener áreas: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { ListaRoles, ListaAreas };
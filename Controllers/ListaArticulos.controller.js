const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const ListaArticulos = async (req, res) => {
    const response = new ResponseDto();
    try {
        const {token} = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        const data = await db.query("select * from obtener_articulos();");
        logger.info(`Consulta de los bienes realizada por ${userData.data.usuario}`);
        if (!data){
            response.isSuccess = false;
            response.message = "Sin bienes";
            response.data = null;
        }
        response.isSuccess = true;
        response.message = "";
        response.data = data;
        return res.status(200).json(response);
    } catch (error) {
        logger.error(`Error al obtener los datos: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { ListaArticulos };
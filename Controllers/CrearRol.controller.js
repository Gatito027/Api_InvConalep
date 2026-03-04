const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const CrearRol = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _nombre, _permisos } = req.body;
		console.log(_nombre, _permisos);
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Solicitud de creacion de rol iniciada por: ${userData?.data?.usuario || 'usuario desconocido'}`);
        //console.log("Nuevorol", _rol, "/", _usuarioId);
        const result = await db.one('SELECT crear_rol_con_permisos($1, $2::int[]) AS CrearRol',[_nombre, _permisos]);

        if (result.crearrol === "Ok") {
            logger.info(`Rol creado por el usuario ${userData?.data?.usuario || 'usuario desconocido'}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al crear el rol, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error interno al crear el rol";
            response.data = null;
            return res.status(500).json(response);
        }

    } catch (error) {
        logger.error(`Error al crear un nuevo rol: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error al crear un nuevo rol";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { CrearRol };
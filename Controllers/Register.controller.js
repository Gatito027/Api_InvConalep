const db = require('../Config/database');
const bcrypt = require('bcryptjs');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');

const register = async (req, res) => {
    const response = new ResponseDto();
    try {
        // TODO: Validar si tiene los permisos de acuerdo a la cookie
        const { _usuario, _nombre, _area, _rol, _password } = req.body;

        // Generar hash seguro
        const hash_password = await bcrypt.hash(_password, 10);

        // Ejecutar función en la BD
        const result = await db.one(
            'SELECT * FROM public.crear_usuario($1, $2, $3, $4, $5)',
            [_usuario, _nombre, _area, _rol, hash_password]
        );

        if (result.crear_usuario === "Ok") {
            logger.info(`Usuario registrado: ${_usuario}`);
            response.isSuccess = true;
            response.message = "Usuario registrado correctamente";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al crear una cuenta, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al crear la cuenta";
            response.data = null;
            return res.status(400).json(response);
        }
    } catch (error) {
        logger.error(`Error al crear una cuenta: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error al registrar usuario";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { register };
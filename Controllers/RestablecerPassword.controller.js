const db = require('../Config/database');
const bcrypt = require('bcryptjs');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const RestablecerPassword = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _password, _oldPassword } = req.body;

        // Validar que los campos requeridos existan
        if (!_password || !_oldPassword) {
            response.isSuccess = false;
            response.message = "La contraseña actual y la nueva son requeridas";
            response.data = null;
            return res.status(400).json(response);
        }

        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        const usuarioId = userData?.data?.sub;

        // Validar que el token sea válido
        if (!usuarioId) {
            logger.warn('Intento de cambio de contraseña con token inválido o expirado');
            response.isSuccess = false;
            response.message = "Sesión inválida o expirada";
            response.data = null;
            return res.status(401).json(response);
        }

        logger.info(`Solicitud de cambio de contraseña iniciada por: ${userData?.data?.usuario || 'usuario desconocido'}`);

        const account = await db.oneOrNone(
            'SELECT usuarioid, contrasena FROM public.usuarios AS u WHERE u.usuarioid = $1',
            [usuarioId]
        );

        if (!account) {
            logger.warn(`Usuario ${usuarioId} no encontrado al cambiar contraseña`);
            response.isSuccess = false;
            response.message = "Error al localizar tu cuenta";
            response.data = null;
            return res.status(404).json(response);
        }

        // ✅ Corregido: usar account.contrasena en lugar de result.contrasena
        const passwordMatch = await bcrypt.compare(_oldPassword, account.contrasena);
        if (!passwordMatch) {
            logger.warn(`Contraseña incorrecta para usuario ${usuarioId}`);
            response.isSuccess = false;
            response.message = "Credenciales inválidas";
            response.data = null;
            return res.status(401).json(response);
        }

        // ✅ Corregido: mover el hash antes de usarlo en la query
        const hash_password = await bcrypt.hash(_password, 10);
        const result = await db.one(
            'SELECT * FROM cambiar_password($1, $2)',
            [usuarioId, hash_password]
        );

        if (result.cambiar_password === "Ok") {
            logger.info(`Contraseña cambiada exitosamente para el usuario ${usuarioId}`);
            response.isSuccess = true;
            response.message = "Contraseña actualizada correctamente";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error(`Error en BD al cambiar contraseña del usuario ${usuarioId}`);
            response.isSuccess = false;
            response.message = "Error interno al cambiar la contraseña";
            response.data = null;
            return res.status(500).json(response);
        }

    } catch (error) {
        logger.error(`Error al cambiar contraseña: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error al cambiar la contraseña";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { RestablecerPassword };
const AuthenticationExtensions = require('./AutheticationExtensions');
const ResponseDto = require('../Models/Dto/ResponseDto');

const checkPermissions = (permisosComprobar = []) => {
    return (req, res, next) => {
        const { token } = req.cookies;
        const validar = AuthenticationExtensions.addJwtAuthentication(token);

        if (!validar.isSuccess) {
            const response = new ResponseDto(false, validar.message, null);
            return res.status(401).json(response);
        }

        const permisosUsuario = validar.data?.permisos || [];

        // Verifica que TODOS los permisos requeridos estén en los permisos del usuario
        const tieneTodos = permisosComprobar.every(p => permisosUsuario.includes(p));

        if (!tieneTodos) {
            const response = new ResponseDto(false, "No tienes los permisos necesarios", null);
            return res.status(403).json(response);
        }

        // Si pasa las validaciones, continúa con la siguiente función/middleware
        next();
    };
};

module.exports = { checkPermissions };


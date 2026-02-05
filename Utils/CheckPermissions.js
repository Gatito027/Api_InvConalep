const AuthenticationExtensions = require('./AuthenticationExtensions');
const ResponseDto = require('../Models/Dto/ResponseDto');

const checkPermissions = (permisoComprobar) => {
    return (req, res, next) => {
        const { token } = req.cookies;
        const validar = AuthenticationExtensions.addJwtAuthentication(token);

        if (!validar.isSuccess) {
            const response = new ResponseDto(false, validar.message, null);
            return res.status(401).json(response);
        }

        if (!validar.data.permisos.includes(permisoComprobar)) {
            const response = new ResponseDto(false, "No tienes permiso", null);
            return res.status(403).json(response);
        }

        // Si pasa las validaciones, continúa con la siguiente función/middleware
        next();
    };
};

module.exports = { checkPermissions };

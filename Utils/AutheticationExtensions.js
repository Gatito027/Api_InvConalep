const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtOptions = {
    secret: process.env.JWTSECRET,
    issuer: process.env.ISSUER,
    audience: process.env.AUDIENCE,
};

class AuthenticationExtensions {
    static addJwtAuthentication(token) {
        let response = {
            msg: "",
            isSuccess: false,
            data: null,
        };
        if (!token) {
            response.msg = "Token no válido";
            return response;
        }

        try {
            const decoded = jwt.verify(token, jwtOptions.secret);

            // Validar si el token es emitido por el issuer y tiene el audience esperado
            if (decoded.aud === jwtOptions.audience && decoded.iss === jwtOptions.issuer) {
                response.isSuccess = true;
                response.data = decoded;
            } else {
                response.msg = "Token no coincide con el issuer o audience esperado.";
            }
        } catch (error) {
            response.msg = `Error al verificar el token: ${error.message}`;
        }

        return response;
    }
}

module.exports = AuthenticationExtensions;
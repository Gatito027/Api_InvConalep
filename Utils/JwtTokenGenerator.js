const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtOptions = {
    secret: process.env.JWTSECRET,
    issuer: process.env.ISSUER,
    audience: process.env.AUDIENCE
};


class JwtTokenGenerator {

    generateToken(usuarioData) {
        const key = Buffer.from(jwtOptions.secret, 'ascii');

        const claims = {
            sub: usuarioData.usuarioid,
            usuario: usuarioData.nombreusuario,
            nombre: usuarioData.nombre,
            area: usuarioData.area_acargo,
            rol: usuarioData.rol,
            permisos: usuarioData.permisos
        };

        const token = jwt.sign(claims, jwtOptions.secret, {
            audience: jwtOptions.audience,
            issuer: jwtOptions.issuer,
            expiresIn: '7d',
            algorithm: 'HS256'
        }, key);
        return token;
    }
}

module.exports = JwtTokenGenerator;
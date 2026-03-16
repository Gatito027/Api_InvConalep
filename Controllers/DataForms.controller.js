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

const ObtenerRolUsuario = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _usuarioId } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("select rolid from usuarios where usuarioid = $1;",[_usuarioId]);
        logger.info(`Consulta de rol para ${_usuarioId} realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        if (data.length !== 0) {
            response.isSuccess = true;
            response.message = "";
            response.data = data;
            return res.status(200).json(response);
        } else {
            response.isSuccess = false;
            response.message = "No se encontró rol para el usuario";
            response.data = null;
            return res.status(404).json(response);
        }

    } catch (error) {
        logger.error(`Error al obtener el rol: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const ObtenerAreaUsuario = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _usuarioId } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("select areacargoid from usuarios where usuarioid = $1;",[_usuarioId]);
        logger.info(`Consulta de area para ${_usuarioId} realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        if (data.length !== 0) {
            response.isSuccess = true;
            response.message = "";
            response.data = data;
            return res.status(200).json(response);
        } else {
            response.isSuccess = false;
            response.message = "No se encontró area para el usuario";
            response.data = null;
            return res.status(404).json(response);
        }

    } catch (error) {
        logger.error(`Error al obtener el area: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const ObtenerPermisos = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("select * from permisos order by permisoid;");
        logger.info(`Consulta de permisos realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        response.isSuccess = true;
        response.message = "";
        response.data = data;
        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Error al obtener los permisos: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const ObtenerPermisosRol = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _rolId } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("select * from obtener_roles_permisos_by_id($1);",[_rolId]);
        logger.info(`Consulta de roles realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        if (data.length !== 0) {
            response.isSuccess = true;
            response.message = "";
            response.data = data;
            return res.status(200).json(response);
        } else {
            response.isSuccess = false;
            response.message = "No se encontró este rol";
            response.data = null;
            return res.status(404).json(response);
        }
    } catch (error) {
        logger.error(`Error al obtener los roles con permisos: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const ObtenerPersonas = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("select usuarioid, nombre from usuarios;",[]);
        logger.info(`Consulta de usuarios realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        if (data.length !== 0) {
            response.isSuccess = true;
            response.message = "";
            response.data = data;
            return res.status(200).json(response);
        } else {
            response.isSuccess = false;
            response.message = "No se encontró registros";
            response.data = null;
            return res.status(404).json(response);
        }
    } catch (error) {
        logger.error(`Error al obtener los usuarios: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const ObtenerItemsAsignados = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _ItemId } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("select u.usuarioid, u.nombre from asignaciones as a inner join usuarios as u on a.usuarioid = u.usuarioid where a.bienid = $1;",[_ItemId]);
        logger.info(`Consulta de usuarios realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        if (data.length !== 0) {
            response.isSuccess = true;
            response.message = "";
            response.data = data;
            return res.status(200).json(response);
        } else {
            response.isSuccess = false;
            response.message = "No se encontró registros";
            response.data = null;
            return res.status(404).json(response);
        }
    } catch (error) {
        logger.error(`Error al obtener los usuarios: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const ListaLugares = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);

        const data = await db.query("SELECT * FROM public.lugares;");
        logger.info(`Consulta de lugares realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        response.isSuccess = true;
        response.message = "";
        response.data = data;
        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Error al obtener lugares: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { ListaRoles, ListaAreas, ObtenerRolUsuario, ObtenerAreaUsuario, ObtenerPermisos, ObtenerPermisosRol, ObtenerPersonas, ObtenerItemsAsignados, ListaLugares };
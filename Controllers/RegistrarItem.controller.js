const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');
const path = require("path");

const convertirFecha = (fecha) => {
    if (!fecha || fecha === "undefined" || fecha === "null") return null;
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return null; // fecha inválida
    return date;
};

const toInt = (val) => {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
};

const toFloat = (val) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
};

const RegistrarUbicacion = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _ubicacion } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Registro de un nueva ubicacion realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one("select * from registrar_lugar($1);", [_ubicacion]);
        if (result.registrar_lugar === "Ok") {
            logger.info(`Ubicacion registrada: ${_ubicacion}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al crear la ubicación, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al guardar la ubicacion";
            response.data = null;
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.error(`Error al registrar una ubicacion: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const RegistrarMarca = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _marca } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Registro de una nueva marca realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one("select * from registrar_marca($1);", [_marca]);
        if (result.registrar_marca === "Ok") {
            logger.info(`Marca registrada: ${_marca}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al guardar la marca, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al guardar la marca";
            response.data = null;
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.error(`Error al registrar una marca: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const RegistrarModelo = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _modelo } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Registro de un modelo realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one("select * from registrar_modelo($1);", [_modelo]);
        if (result.registrar_modelo === "Ok") {
            logger.info(`Modelo registrado: ${_modelo}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al guardar el modelo, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al guardar el modelo";
            response.data = null;
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.error(`Error al registrar un modelo: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const RegistrarCuenta = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const { _tipo } = req.body;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Registro de un tipo de bien realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one("select * from registrar_cuenta($1);", [_tipo]);
        if (result.registrar_cuenta === "Ok") {
            logger.info(`Tipo registrado: ${_tipo}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al guardar el tipo, fallo en la BD');
            response.isSuccess = false;
            response.message = "Error al guardar el tipo";
            response.data = null;
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.error(`Error al registrar un tipo: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        return res.status(500).json(response);
    }
};

const RegistrarItem = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const {
            _descripcion,
            _subcuenta,
            _codigoPartida,
            _numeroInv,
            _observaciones,
            _lugarId,
            _marcaId,
            _modeloId,
            _numeroSerie,
            _estado,
            _costoAdquisicion,
            _depreciacion,
            _valorLibros,
            _fechaResguardo,
            _motivoResguardo,
            _departamentoId,
            _fechaAdquisicion,
            _fechaAlta,
            _cantidad,
            _donativo,
            _cotizacion,
            _cuenta,
            _vidaUtil,
            _fechaBaja,
            _tipoBaja,
            _fechaPoliza,
            _fechaDocumentoPoliza
        } = req.body;

        //console.log(req.body);

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        let imageUrl;
        let imageLocalPath;
        let bajaUrl;
        let bajaLocalPath;
        let polizaUrl;
        let polizaLocalPath;

        if (req.files) {
            if (req.files["imagen"]) {
                const file = req.files["imagen"][0];
                imageUrl = `${baseUrl}/Uploads/imagenes/${file.filename}`;
                imageLocalPath = path.join("wwwroot", "Uploads", "imagenes", file.filename);
            }
            if (req.files["baja"]) {
                const file = req.files["baja"][0];
                bajaUrl = `${baseUrl}/Uploads/pdfs/${file.filename}`;
                bajaLocalPath = path.join("wwwroot", "Uploads", "pdfs", file.filename);
            }
            if (req.files["poliza"]) {
                const file = req.files["poliza"][0];
                polizaUrl = `${baseUrl}/Uploads/pdfs/${file.filename}`;
                polizaLocalPath = path.join("wwwroot", "Uploads", "pdfs", file.filename);
            }
        }

        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Registro de un nuevo item realizado por ${userData?.data?.usuario || 'usuario desconocido'}`);
        const result = await db.one("select * from registrar_bien($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33);", [
            imageUrl,
            imageLocalPath,
            toInt(_subcuenta),           // en lugar de parseInt(_subcuenta, 10)
            _codigoPartida || null,
            toInt(_numeroInv),
            _observaciones || null,
            toInt(_lugarId),
            _descripcion,
            toInt(_marcaId),
            toInt(_modeloId),
            _numeroSerie || null,
            _estado,
            toFloat(_costoAdquisicion),  // en lugar de parseFloat(...)
            toFloat(_depreciacion),
            toFloat(_valorLibros),
            convertirFecha(_fechaResguardo),
            _motivoResguardo || null,
            toInt(_departamentoId),
            convertirFecha(_fechaAdquisicion),
            convertirFecha(_fechaAlta),
            toInt(_cantidad),
            _donativo === "true" || _donativo === true, // Boolean() no es suficiente con strings
            toFloat(_cotizacion),
            _cuenta || null,
            toInt(_vidaUtil),
            convertirFecha(_fechaBaja),
            _tipoBaja || null,
            bajaUrl || null,
            bajaLocalPath || null,
            convertirFecha(_fechaPoliza),
            convertirFecha(_fechaDocumentoPoliza),
            polizaUrl || null,
            polizaLocalPath || null,
        ]);
        //console.log(result);
        if (result.registrar_bien === "Ok") {
            logger.info(`Item registrado: ${_descripcion}`);
            response.isSuccess = true;
            response.message = "";
            response.data = null;
            return res.status(200).json(response);
        } else {
            logger.error('Error al registrar el item', result);
            response.isSuccess = false;
            response.message = "Error al registrar el item";
            response.data = null;
            if (fs.existsSync(imageLocalPath)) {
                await fs.promises.unlink(imageLocalPath);
            }
            if (fs.existsSync(bajaLocalPath)) {
                await fs.promises.unlink(bajaLocalPath);
            }
            if (fs.existsSync(polizaLocalPath)) {
                await fs.promises.unlink(polizaLocalPath);
            }
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.error(`Error al registrar un item: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        response.data = null;
        if (fs.existsSync(imageLocalPath)) {
            await fs.promises.unlink(imageLocalPath);
        }
        if (fs.existsSync(bajaLocalPath)) {
            await fs.promises.unlink(bajaLocalPath);
        }
        if (fs.existsSync(polizaLocalPath)) {
            await fs.promises.unlink(polizaLocalPath);
        }
        return res.status(500).json(response);
    }
};

module.exports = { RegistrarCuenta, RegistrarMarca, RegistrarUbicacion, RegistrarModelo, RegistrarItem };
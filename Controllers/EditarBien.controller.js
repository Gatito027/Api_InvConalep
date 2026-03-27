const path = require("path");
const fs = require("fs");
const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const convertirFecha = (fecha) => {
    if (!fecha || fecha === "undefined" || fecha === "null") return null;
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return null;
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

const eliminarArchivo = async (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
    }
};

const EditarBien = async (req, res) => {
    const response = new ResponseDto();

    // Rutas locales de archivos NUEVOS (para revertir si algo falla)
    let imageLocalPath = null;
    let bajaLocalPath = null;
    let polizaLocalPath = null;

    try {
        const { token } = req.cookies;
        const {
            _ItemId,
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
            _fechaDocumentoPoliza,
            _borrarBaja,
            _borrarPoliza
        } = req.body;

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Edición de bien realizada por ${userData?.data?.usuario || 'usuario desconocido'}`);

        // ─── Obtener datos actuales del bien (paths y IDs viejos) ─────────────
        const articuloOldData = await db.oneOrNone(
            `SELECT imagenpath, bajaid, polizaid FROM bienes WHERE bienid = $1;`,
            [_ItemId]
        );

        if (!articuloOldData) {
            response.isSuccess = false;
            response.message = "Bien no encontrado";
            return res.status(404).json(response);
        }

        const oldImagenPath = articuloOldData.imagenpath || null;
        const oldBajaId     = articuloOldData.bajaid    || null;
        const oldPolizaId   = articuloOldData.polizaid  || null;
        let oldBajaPath     = null;
        let oldPolizaPath   = null;

        if (oldBajaId) {
            const row = await db.oneOrNone(
                "SELECT documentopath FROM bajas WHERE bajaid = $1;",
                [oldBajaId]
            );
            oldBajaPath = row?.documentopath || null;
        }

        if (oldPolizaId) {
            const row = await db.oneOrNone(
                "SELECT documentopath FROM polizas WHERE polizaid = $1;",
                [oldPolizaId]
            );
            oldPolizaPath = row?.documentopath || null;
        }

        // ─── Procesar archivos nuevos ─────────────────────────────────────────
        let imageUrl    = null;
        let bajaUrl     = null;
        let polizaUrl   = null;

        if (req.files["imagen"]) {
            const file      = req.files["imagen"][0];
            imageUrl        = `${baseUrl}/Uploads/imagenes/${file.filename}`;
            imageLocalPath  = path.join("wwwroot", "Uploads", "imagenes", file.filename);
        }

        if (req.files["baja"]) {
            const file      = req.files["baja"][0];
            bajaUrl         = `${baseUrl}/Uploads/pdfs/${file.filename}`;
            bajaLocalPath   = path.join("wwwroot", "Uploads", "pdfs", file.filename);
        }

        if (req.files["poliza"]) {
            const file      = req.files["poliza"][0];
            polizaUrl       = `${baseUrl}/Uploads/pdfs/${file.filename}`;
            polizaLocalPath = path.join("wwwroot", "Uploads", "pdfs", file.filename);
        }

        const eliminarBaja   = _borrarBaja   === "true" || _borrarBaja   === true;
        const eliminarPoliza = _borrarPoliza === "true" || _borrarPoliza === true;

        // ─── Llamar al stored procedure ───────────────────────────────────────
        const result = await db.one(
            `SELECT editar_bien(
                $1,  $2,  $3,  $4,  $5,  $6,  $7,  $8,  $9,  $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
                $31, $32, $33, $34, $35, $36, $37, $38
            )`,
            [
                toInt(_ItemId),                                      // $1  item_id
                imageUrl,                                            // $2  imagen_url
                imageLocalPath,                                      // $3  imagen_path
                toInt(_subcuenta),                                   // $4  subcuenta
                _codigoPartida          || null,                     // $5  codigo_partida
                toInt(_numeroInv),                                   // $6  numero_inv
                _observaciones          || null,                     // $7  observaciones_o
                toInt(_lugarId),                                     // $8  lugar_id
                _descripcion,                                        // $9  descripcion_d
                toInt(_marcaId),                                     // $10 marca_id
                toInt(_modeloId),                                    // $11 modelo_id
                _numeroSerie            || null,                     // $12 numero_serie
                _estado,                                             // $13 estado_e
                toFloat(_costoAdquisicion),                          // $14 costo_adquisicion
                toFloat(_depreciacion),                              // $15 depreciacion_d
                toFloat(_valorLibros),                               // $16 valor_libros
                convertirFecha(_fechaResguardo),                     // $17 fecha_resguardo
                _motivoResguardo        || null,                     // $18 motivo_resguardo
                toInt(_departamentoId),                              // $19 departamento_id
                convertirFecha(_fechaAdquisicion),                   // $20 fecha_adquisicion
                convertirFecha(_fechaAlta),                          // $21 fecha_alta
                toInt(_cantidad),                                    // $22 cantidad_c
                _donativo === "true" || _donativo === true,          // $23 donativo_d
                toFloat(_cotizacion),                                // $24 cotizacion
                _cuenta                 || null,                     // $25 cuenta
                toInt(_vidaUtil),                                    // $26 vida_util
                oldBajaId,                                           // $27 baja_id
                oldPolizaId,                                         // $28 poliza_id
                eliminarBaja,                                        // $29 eliminar_baja
                eliminarPoliza,                                      // $30 eliminar_poliza
                convertirFecha(_fechaBaja),                          // $31 fecha_baja
                _tipoBaja               || null,                     // $32 tipo_baja
                bajaUrl                 || null,                     // $33 documento_baja_url
                bajaLocalPath           || null,                     // $34 documento_baja_path
                convertirFecha(_fechaPoliza),                        // $35 fecha_poliza
                convertirFecha(_fechaDocumentoPoliza),               // $36 fecha_documento_poliza
                polizaUrl               || null,                     // $37 documento_url_poliza
                polizaLocalPath         || null,                     // $38 documento_path_poliza
            ]
        );
        console.log(result);
        // ─── Verificar resultado ──────────────────────────────────────────────
        if (result.editar_bien === "Ok") {
            logger.info(`Item editado: ${_descripcion}`);

            // Eliminar archivos VIEJOS reemplazados por nuevos
            if (imageLocalPath  && oldImagenPath)  await eliminarArchivo(oldImagenPath);
            if (bajaLocalPath   && oldBajaPath)    await eliminarArchivo(oldBajaPath);
            if (polizaLocalPath && oldPolizaPath)  await eliminarArchivo(oldPolizaPath);

            // Eliminar archivos físicos al borrar baja/póliza
            if (eliminarBaja   && oldBajaPath)     await eliminarArchivo(oldBajaPath);
            if (eliminarPoliza && oldPolizaPath)   await eliminarArchivo(oldPolizaPath);

            response.isSuccess = true;
            response.message   = "";
            response.data      = null;
            return res.status(200).json(response);

        } else {
            logger.error('Error al editar el item:', result.editar_bien);

            // Revertir: eliminar archivos NUEVOS subidos en esta request
            await eliminarArchivo(imageLocalPath);
            await eliminarArchivo(bajaLocalPath);
            await eliminarArchivo(polizaLocalPath);

            response.isSuccess = false;
            response.message   = "Error al editar el item";
            response.data      = null;
            return res.status(400).json(response);
        }

    } catch (error) {
        logger.error(`Error al editar un artículo: ${error.message}`);

        // Revertir: eliminar archivos NUEVOS subidos en esta request
        await eliminarArchivo(imageLocalPath);
        await eliminarArchivo(bajaLocalPath);
        await eliminarArchivo(polizaLocalPath);

        response.isSuccess = false;
        response.message   = "Error interno del servidor";
        return res.status(500).json(response);
    }
};

module.exports = { EditarBien };
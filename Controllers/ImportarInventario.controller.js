const fs = require("fs");
const ParseExcelInventario = require("../Service/parseExcelInventario");
const ResponseDto = require("../Models/Dto/ResponseDto");
const db = require('../Config/database');
const logger = require('../Utils/logger');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');
const path = require("path");
const { getIo } = require('../Config/socket');

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

const ImportarInventario = async (req, res) => {
    const response = new ResponseDto();
    let archivoLocalPath;
    try {
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Importacion de inventario iniciado por ${userData?.data?.usuario || 'usuario desconocido'}`);

        const file = req.files?.archivo?.[0];
        if (!file) {
            logger.warn('No se subio un archivo valido para importar');
            response.isSuccess = false;
            response.message = "No se recibió ningún archivo";
            return res.status(400).json(response);
        }

        archivoLocalPath = file.path;
        const buffer = fs.readFileSync(file.path);
        const registros = await ParseExcelInventario.parseExcel(buffer);

        const resumen = {
            total: registros.length,
            registrados: 0,
            warns: 0,
            errores: 0,
            detalle: [],
        };

        // Notificar al cliente que inició la importación
        const io = getIo();
        io.emit('importacion:inicio', { total: resumen.total });

        for (const [index, registro] of registros.entries()) {
            const fila = index + 2;
            try {
                let marcaRegistrada = null;
                let modeloRegistrado = null;
                let cuentaRegistrada = null;

                if (registro.marca) {
                    marcaRegistrada = await db.oneOrNone(
                        "SELECT marcaid FROM marcas WHERE nombre = $1;",
                        [registro.marca]
                    );
                    if (!marcaRegistrada) {
                        resumen.warns++;
                        const warn = { fila, tipo: 'warn', mensaje: `Marca "${registro.marca}" no encontrada` };
                        resumen.detalle.push(warn);
                        logger.warn(`Fila ${fila}: ${warn.mensaje}`);
                        io.emit('importacion:progreso', { ...resumen, ultimoEvento: warn });
                    }
                }

                if (registro.modelo) {
                    modeloRegistrado = await db.oneOrNone(
                        "SELECT modeloid FROM modelos WHERE nombre = $1;",
                        [registro.modelo]
                    );
                    if (!modeloRegistrado) {
                        resumen.warns++;
                        const warn = { fila, tipo: 'warn', mensaje: `Modelo "${registro.modelo}" no encontrado` };
                        resumen.detalle.push(warn);
                        logger.warn(`Fila ${fila}: ${warn.mensaje}`);
                        io.emit('importacion:progreso', { ...resumen, ultimoEvento: warn });
                    }
                }

                if (registro.cuenta) {
                    cuentaRegistrada = await db.oneOrNone(
                        "SELECT departamentoid FROM departamentos WHERE nombre = $1;",
                        [registro.cuenta]
                    );
                    if (!cuentaRegistrada) {
                        cuentaRegistrada = await db.one(
                            "INSERT INTO public.departamentos (nombre) VALUES($1) RETURNING departamentoid;",
                            [registro.cuenta]
                        );
                        logger.info(`Fila ${fila}: departamento "${registro.cuenta}" creado`);
                    }
                }

                await db.one(
                    "SELECT * FROM registrar_bien($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33);",
                    [
                        registro.imagen_url,
                        null,
                        toInt(registro.subcuenta),
                        registro.codigo_partida || null,
                        toInt(registro.numeroInv),
                        registro.observaciones || null,
                        toInt(registro.lugar_id) || 1,
                        registro.descripcion,
                        marcaRegistrada ? toInt(marcaRegistrada.marcaid) : null,
                        modeloRegistrado ? toInt(modeloRegistrado.modeloid) : null,
                        registro.serie || null,
                        registro.estado || "Desconocido",
                        toFloat(registro.costo_adquisicion),
                        toFloat(registro.depreciacion),
                        toFloat(registro.valor_libros),
                        convertirFecha(registro.fecha_resguardo),
                        registro.motivo_resguardo || null,
                        cuentaRegistrada ? toInt(cuentaRegistrada.departamentoid) : toInt(registro.departamento_id),
                        convertirFecha(registro.fecha_adquision),
                        convertirFecha(registro.fecha_alta),
                        toInt(registro.cantidad) || 1,
                        registro.donativo === "true" || registro.donativo === true,
                        toFloat(registro.valor_cotizacion),
                        registro.departamento || null,
                        toInt(registro.vida_util),
                        convertirFecha(registro.fecha_baja),
                        registro.tipo_baja || null,
                        registro.documento_baja || null,
                        null,
                        convertirFecha(registro.fecha_poliza),
                        convertirFecha(registro.fecha_documento_poliza),
                        registro.documento_url_poliza || null,
                        null,
                    ]
                );

                resumen.registrados++;
                const ok = { fila, tipo: 'ok', mensaje: `Fila ${fila} registrada correctamente` };
                resumen.detalle.push(ok);
                logger.info(`Fila ${fila}: registrada correctamente`);

                // Emitir progreso tras cada fila exitosa
                io.emit('importacion:progreso', { ...resumen, ultimoEvento: ok });

            } catch (errorFila) {
                resumen.errores++;
                const err = { fila, tipo: 'error', mensaje: errorFila.message };
                resumen.detalle.push(err);
                logger.error(`Fila ${fila}: ${errorFila.message}`);

                // Emitir progreso tras cada fila con error
                io.emit('importacion:progreso', { ...resumen, ultimoEvento: err });
            }
        }

        // Notificar que terminó
        io.emit('importacion:fin', resumen);
        logger.info(`Importación finalizada — Total: ${resumen.total} | OK: ${resumen.registrados} | Warns: ${resumen.warns} | Errores: ${resumen.errores}`);

        response.isSuccess = true;
        response.message = "Importación finalizada";
        response.data = resumen;
        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Error general al importar inventario: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        return res.status(500).json(response);
    } finally {
        if (archivoLocalPath && fs.existsSync(archivoLocalPath)) {
            await fs.promises.unlink(archivoLocalPath);
        }
    }
};

module.exports = { ImportarInventario };
const path = require("path");
const fs = require("fs");
const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');

const DeleteArticulo = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { _ItemId } = req.body;
        const { token } = req.cookies;
        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Eliminación de artículo realizada por ${userData.data.usuario}`);

        // Obtener datos del artículo
        const articuloData = await db.oneOrNone(
            "SELECT b.imagenpath, b.bajaid, b.polizaid FROM bienes AS b WHERE b.bienid = $1;",
            [_ItemId]
        );

        if (!articuloData) {
            response.isSuccess = false;
            response.message = "Artículo no encontrado";
            return res.status(404).json(response);
        }

        // Eliminar imagen si existe
        if (articuloData.imagenpath) {
            const oldFilePath = path.join(process.cwd(), articuloData.imagenpath);
            if (fs.existsSync(oldFilePath)) {
                await fs.promises.unlink(oldFilePath);
            }
        }

        // Eliminar póliza si existe
        if (articuloData.polizaid) {
            const poliza = await db.oneOrNone(
                "SELECT p.documentopath FROM polizas AS p WHERE p.polizaid = $1;",
                [articuloData.polizaid]
            );
            if (poliza?.documentopath) {
                const oldFilePath = path.join(process.cwd(), poliza.documentopath);
                if (fs.existsSync(oldFilePath)) {
                    await fs.promises.unlink(oldFilePath);
                }
            }
        }

        // Eliminar baja si existe
        if (articuloData.bajaid) {
            const baja = await db.oneOrNone(
                "SELECT b.documentopath FROM bajas AS b WHERE b.bajaid = $1;",
                [articuloData.bajaid]
            );
            if (baja?.documentopath) {
                const oldFilePath = path.join(process.cwd(), baja.documentopath);
                if (fs.existsSync(oldFilePath)) {
                    await fs.promises.unlink(oldFilePath);
                }
            }
        }

        // Ejecutar función en BD
        const result = await db.one("SELECT eliminar_articulo($1) AS status;", [_ItemId]);

        if (result.status === "Ok") {
            logger.info(`Artículo eliminado correctamente`);
            response.isSuccess = true;
            response.message = "";
            return res.status(200).json(response);
        } else {
            logger.error('Error al eliminar un artículo:', result);
            response.isSuccess = false;
            response.message = "Error al eliminar el item";
            return res.status(400).json(response);
        }
    } catch (error) {
        logger.error(`Error al eliminar un artículo: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno del servidor";
        return res.status(500).json(response);
    }
};

module.exports = { DeleteArticulo };
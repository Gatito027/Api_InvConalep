const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');
const convertirDatos = require('../Service/convetirDatos');
const ExcelJS = require("@ayocore/exceljs");
const QRCode = require('qrcode');

// Tamaño del QR en píxeles (cuadrado)
const QR_SIZE = 80;
// Alto de fila en "puntos Excel" — aprox QR_SIZE * 0.75
const ROW_HEIGHT = 100;
// Ancho de columna QR en caracteres — aprox QR_SIZE / 7
const QR_COL_WIDTH = 20;

// Genera un QR como Buffer PNG en memoria
const generarQR = (texto) =>
    QRCode.toBuffer(String(texto), { width: QR_SIZE, margin: 1 });

const EtiquetadoInvetario = async (req, res)=> {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const {
            _startedNumInv, _endNumInv,
            _estado, _lugarId, _descripcion,
            _startedFechaAlta, _endFechaAlta,
            _startedFechaAdq, _endFechaAdq,
            _usuarioId, _donativo
        } = req.body;

        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Exportación QR realizada por ${userData.data.usuario}`);

        const data = await db.query(
            `SELECT * FROM exportar_bienes(
                p_inv_inicio        => $1,  p_inv_fin           => $2,
                p_estado            => $3,  p_lugarid           => $4,
                p_donativo          => $5,  p_fecha_alta_inicio => $6,
                p_fecha_alta_fin    => $7,  p_descripcion       => $8,
                p_fecha_adq_inicio  => $9,  p_fecha_adq_fin     => $10,
                p_usuarioid         => $11
            )`,
            [
                convertirDatos.toInt(_startedNumInv) || null,
                convertirDatos.toInt(_endNumInv) || null,
                _estado || null,
                convertirDatos.toInt(_lugarId) || null,
                _donativo === true ? true : null,
                convertirDatos.convertirFecha(_startedFechaAlta) || null,
                convertirDatos.convertirFecha(_endFechaAlta) || null,
                _descripcion || null,
                convertirDatos.convertirFecha(_startedFechaAdq) || null,
                convertirDatos.convertirFecha(_endFechaAdq) || null,
                convertirDatos.toInt(_usuarioId) || null,
            ]
        );

        if (!data || data.length === 0) {
            response.isSuccess = false;
            response.message = "No hay datos para exportar";
            return res.status(200).json(response);
        }

        const rows = data;
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('QR Inventario');

        // ── Columnas ──────────────────────────────────────────────
        // Layout: QR | No.Inv | QR | No.Inv  (4 columnas, 2 items por fila)
        sheet.columns = [
            { key: 'qr1',  width: QR_COL_WIDTH },
            { key: 'inv1', width: 18 },
            { key: 'qr2',  width: QR_COL_WIDTH },
            { key: 'inv2', width: 18 },
        ];

        // ── Filas con QR ──────────────────────────────────────────
        // Agrupamos de 2 en 2 para llenar las 4 columnas
        for (let i = 0; i < rows.length; i += 2) {
            const excelRowNum = Math.floor(i / 2) + 1;
            const row = sheet.getRow(excelRowNum);
            row.height = ROW_HEIGHT;

            const item1 = rows[i];
            const item2 = rows[i + 1] || null;

            // Texto del número de inventario (columnas B y D)
            const numInv1 = item1.numeroinventario ?? 'Sin inventario';
            const numInv2 = item2 ? (item2.numeroinventario ?? 'Sin inventario') : '';

            row.getCell(2).value = numInv1;
            row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };

            if (item2) {
                row.getCell(4).value = numInv2;
                row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
            }
            row.commit();

            // Generar e insertar QR del item 1 (columna A)
            const qrBuffer1 = await generarQR(numInv1);
            const imgId1 = workbook.addImage({ buffer: qrBuffer1, extension: 'png' });
            sheet.addImage(imgId1, {
                tl: { col: 0, row: excelRowNum - 1 },   // top-left (0-indexed)
                ext: { width: QR_SIZE, height: QR_SIZE },
                editAs: 'oneCell',
            });

            // Generar e insertar QR del item 2 (columna C)
            if (item2) {
                const qrBuffer2 = await generarQR(numInv2);
                const imgId2 = workbook.addImage({ buffer: qrBuffer2, extension: 'png' });
                sheet.addImage(imgId2, {
                    tl: { col: 2, row: excelRowNum - 1 },
                    ext: { width: QR_SIZE, height: QR_SIZE },
                    editAs: 'oneCell',
                });
            }
        }

        const fechaHoja = new Date().toLocaleDateString('es-MX').replace(/\//g, '-');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="qr-inventario-${fechaHoja}.xlsx"`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        logger.error(`Error al exportar QR: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno";
        return res.status(500).json(response);
    }
};

module.exports = {EtiquetadoInvetario};
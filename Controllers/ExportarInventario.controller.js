const db = require('../Config/database');
const logger = require('../Utils/logger');
const ResponseDto = require('../Models/Dto/ResponseDto');
const AuthenticationExtensions = require('../Utils/AutheticationExtensions');
const convertirDatos = require('../Service/convetirDatos');
//const Inventario = require('../Service/InventarioMap');
const ExcelJS = require("@ayocore/exceljs");
// Define fuera del handler para reutil
const COLUMN_CONFIG_INV = [
    { key: 'bienid',               header: 'Número',                        width: 10,  nullText: ''},
    { key: 'imagenurl',            header: 'Imagen',                        width: 30,  nullText: 'Sin imagen'},
    { key: 'codigodepartida',      header: 'Código',                        width: 15,  nullText: ''},
    { key: 'fecha_alta',           header: 'Fecha alta',                    width: 15,  nullText: 'Sin fecha' },
    { key: 'descripcion',          header: 'Descripción',                   width: 40,  nullText: 'Sin descripción' },
    { key: 'cantidad',             header: 'Cantidad',                      width: 10,  nullText: '0' },
    { key: 'marca',                header: 'Marca',                         width: 15,  nullText: '0'},
    { key: 'modelo',               header: 'Modelo',                        width: 15,  nullText: '0'},
    { key: 'numeroserie',          header: 'Serie',                         width: 20,  nullText: 'N/A'},
    { key: 'numeroinventario',       header: 'No. de inventario',             width: 18,  nullText: 'Sin inventario' },
    { key: 'nombre_persona',       header: 'Nombre de la persona',          width: 30,  nullText: ''},
    { key: 'depcuenta',            header: 'Nombre de la cuenta',           width: 30,  nullText: ''},
    { key: 'cuenta',               header: 'Cuenta dep.',                   width: 15,  nullText: ''},
    { key: 'fechaadquision',       header: 'Fecha Adq.',                    width: 15,  nullText: ''},
    { key: 'cotizacion',           header: 'Valor Cotización',              width: 18,  nullText: ''},
    { key: 'costoadquision',       header: 'Costo Adq.',                    width: 15,  nullText: '' },
    { key: 'vidautil',             header: 'Años de vida útil',             width: 18,  nullText: ''},
    { key: 'estado',               header: 'Estatus',                       width: 15,  nullText: 'No definido' },
    { key: 'lugar',                header: 'Ubicación',                     width: 25,  nullText: 'Sin ubicación' },
    { key: 'donativo',             header: '¿Es Donativo?',                 width: 15,  nullText: 'No', transform: v => v ? 'Sí' : 'No' },
    { key: 'observaciones',        header: 'Observaciones',                 width: 35,  nullText: '' },
    { key: 'despreciacion',        header: 'Depreciación',                  width: 15,  nullText: '' },
    { key: 'valorlibros',          header: 'Valor en libros',               width: 18,  nullText: '' },
    { key: 'fecharesguardo',       header: 'Fecha de resguardo',            width: 20,  nullText: 'No aplica' },
    { key: 'motivoresguardo',      header: 'Motivo de resguardo',           width: 25,  nullText: 'No aplica' },
    { key: 'fechabaja',            header: 'Fecha de baja',                 width: 18,  nullText: 'No aplica' },
    { key: 'tipobaja',             header: 'Tipo de baja',                  width: 18,  nullText: 'No aplica' },
    { key: 'documentobaja',        header: 'Documento de baja',             width: 22,  nullText: 'No aplica' },
    { key: 'fechapoliza',          header: 'Fecha de póliza',               width: 18,  nullText: 'No aplica' },
    { key: 'fechadocumentopoliza', header: 'Fecha del documento de póliza', width: 30,  nullText: 'No aplica' },
    { key: 'documentopoliza',      header: 'Documento de póliza',           width: 22,  nullText: 'No aplica' },  // ✅ quitado el ":" del key
];

const ExportarInvetario = async (req, res) => {
    const response = new ResponseDto();
    try {
        const { token } = req.cookies;
        const {
            _startedNumInv, _endNumInv,
            _estado,
            _lugarId,
            _descripcion,
            _startedFechaAlta, _endFechaAlta,
            _startedFechaAdq, _endFechaAdq,
            _usuarioId,
            _donativo
        } = req.body;

        const userData = AuthenticationExtensions.addJwtAuthentication(token);
        logger.info(`Exportacion del inventario realizada por ${userData.data.usuario}`);

        const data = await db.query(
            `SELECT * FROM exportar_bienes(
                p_inv_inicio        => $1,
                p_inv_fin           => $2,
                p_estado            => $3,
                p_lugarid           => $4,
                p_donativo          => $5,
                p_fecha_alta_inicio => $6,
                p_fecha_alta_fin    => $7,
                p_descripcion       => $8,
                p_fecha_adq_inicio  => $9,
                p_fecha_adq_fin     => $10,
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
        //console.log(data);

        // ✅ FIX 1: era "result" pero la variable se llama "data"
        // ✅ FIX 2: la validación de error no aplica aquí porque exportar_bienes
        //           devuelve filas, no un campo de status — se valida con rows.length
        if (!data || data.length === 0) {
            logger.info(`No se encontraron registros para exportar`);
            response.isSuccess = false;
            response.message = "No hay datos para exportar";
            response.data = null;
            return res.status(200).json(response);
        }

        const rows = data;
        const workbook = new ExcelJS.Workbook();

        // ✅ FIX 3: Date() genera string con espacios y comas, inválido para nombre de hoja
        const fechaHoja = new Date().toLocaleDateString('es-MX').replace(/\//g, '-');
        const sheet = workbook.addWorksheet(`Inventario ${fechaHoja}`);

        sheet.columns = COLUMN_CONFIG_INV.map(col => ({
            header: col.header,
            key:    col.key,
            width:  col.width,
        }));

        sheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F75B6' } };
            cell.alignment = { horizontal: 'center' };
        });

        // ✅ FIX 4: usaba "COLUMN_CONFIG" sin definir — debe ser "Inventario.COLUMN_CONFIG_INV"
        rows.forEach(row => {
            const rowData = {};

            COLUMN_CONFIG_INV.forEach(col => {
                const value = row[col.key];

                if (value === null || value === undefined || value === '') {
                    rowData[col.key] = col.nullText ?? 'N/A';
                } else if (col.transform) {
                    rowData[col.key] = col.transform(value);
                } else {
                    rowData[col.key] = value;
                }
            });

            sheet.addRow(rowData);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="inventario-${fechaHoja}.xlsx"`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        logger.error(`Error al exportar el inventario: ${error.message}`);
        response.isSuccess = false;
        response.message = "Error interno";
        response.data = null;
        return res.status(500).json(response);
    }
};

module.exports = { ExportarInvetario };
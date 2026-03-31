const ExcelJS = require("@ayocore/exceljs");

// Mapeo: título en Excel → campo en BD
const COLUMN_MAP = {
  "Imagen": "imagen_url",
  "Sub. cuenta": "subcuenta",
  "Código": "codigo_partida",
  "No. de inventario": "numeroInv",
  "Observaciones": "observaciones",
  "Identificador de lugar": "lugar_id",
  "Descripción": "descripcion",
  "Marca": "marca",
  "Modelo": "modelo",
  "Serie": "serie",
  "Estatus": "estado",
  "Costo Adq.": "costo_adquisicion",
  "Despreciación": "depreciacion",
  "Valor en libros": "valor_libros",
  "Fecha de resguardo": "fecha_resguardo",
  "Motivo de resguardo": "motivo_resguardo",
  "Identificadior de la cuenta": "departamento_id",
  "Nombre de la cuenta": "cuenta",
  "Fecha Adq.": "fecha_adquision",
  "Fecha alta": "fecha_alta",
  "Cantidad": "cantidad",
  "Donativo": "donativo",
  "Valor Cotización": "valor_cotizacion",
  "Cuenta Dep.": "departamento",
  "Años de vida útil": "vida_util",
  "Fecha de baja": "fecha_baja",
  "Tipo de baja": "tipo_baja",
  "Documento de baja": "documento_baja",
  "Fecha de poliza": "fecha_poliza",
  "Fecha del documento de poliza": "fecha_documento_poliza",
  "Documento de poliza": "documento_url_poliza",
};

async function parseExcel(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.worksheets[0];
  const registros = [];

  // La primera fila contiene los títulos
  const headerRow = sheet.getRow(1);

  // Construir mapa de índice de columna → campo en BD
  const colIndexMap = {};
  headerRow.eachCell((cell, colIndex) => {
    const titulo = cell.value?.toString().trim();
    if (titulo && COLUMN_MAP[titulo]) {
      colIndexMap[colIndex] = COLUMN_MAP[titulo];
    }
  });

  // Iterar filas de datos (desde la fila 2)
  sheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return; // saltar header

    const record = {};
    row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
      const campo = colIndexMap[colIndex];
      if (campo) {
        record[campo] = cell.value ?? null;
      }
    });

    // Solo agregar si tiene al menos un campo con valor
    if (Object.values(record).some((v) => v !== null)) {
      registros.push(record);
    }
  });

  return registros;
}

module.exports = { parseExcel };
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

module.exports = {convertirFecha, toFloat, toInt};
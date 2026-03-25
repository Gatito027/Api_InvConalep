const express = require('express');
const router = express.Router();
const { validarErrores } = require('../Utils/expressValidator');
const { body } = require('express-validator');
const checkPermissions = require('../Utils/CheckPermissions');
const upload = require("../Utils/multerConfig");
const ListaArticulos = require('../Controllers/ListaArticulos.controller');
const ObtenerArticulo = require('../Controllers/ObtenerArticulo.controller');
const DeleteArticulo = require('../Controllers/DeleteArticulo.controller');
const AsignarArticulo = require('../Controllers/AsignarArticulo.controller');
const ActualizarLugarArticulo = require('../Controllers/ActualizarLugarArticulo.controller');
const RegistrarItem = require('../Controllers/RegistrarItem.controller');

const uploadMiddleware = upload.fields([
    { name: "imagen", maxCount: 1 },
    { name: "baja", maxCount: 1 },
    { name: "poliza", maxCount: 1 }
]);

// Wrapper que garantiza que Multer termine antes de continuar
const uploadAndParse = (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next(); // Solo avanza cuando Multer ya pobló req.body
    });
};

router.get('/articulos',
    checkPermissions.checkPermissions(['Inventario']),
    ListaArticulos.ListaArticulos
);

router.post('/articulo', [
    body('_ItemId')
        .notEmpty().withMessage('El item es requerido')
        .isInt().withMessage('El item debe ser un número entero'),
], validarErrores,
    checkPermissions.checkPermissions(['Inventario', 'Detalles articulo']),
    ObtenerArticulo.ObtenerArticulo
);

router.delete('/eliminar-articulo', [
    body('_ItemId')
        .notEmpty().withMessage('El item es requerido')
        .isInt().withMessage('El item debe ser un número entero'),],
    validarErrores,
    checkPermissions.checkPermissions(['Inventario', 'Eliminar articulo']),
    DeleteArticulo.DeleteArticulo
);

router.put('/asignar-articulo', [
    body('_ItemId')
        .notEmpty().withMessage('El item es requerido')
        .isInt().withMessage('El item debe ser un número entero'),
    body("_NewPersonaId")
        .optional() // el arreglo puede ir vacío o no enviarse
        .isArray().withMessage("Los usuarios deben ser un arreglo"),
    body("_NewPersonaId.*")
        .isInt().withMessage("Cada usuario debe ser un número entero"),
], validarErrores,
    checkPermissions.checkPermissions(['Inventario', 'Asignar Articulo']),
    AsignarArticulo.AsignarArticulo
);

router.put('/actualizar-lugar', [
    body('_ItemId')
        .notEmpty().withMessage('El item es requerido')
        .isInt().withMessage('El item debe ser un número entero'),
    body('_lugarId')
        .notEmpty().withMessage('El lugar es requerido')
        .isInt().withMessage('El lugar debe ser un número entero'),
], validarErrores,
    checkPermissions.checkPermissions(['Inventario', 'Cambiar ubicacion']),
    ActualizarLugarArticulo.ActualizarLugarArticulo
);

router.put('/actualizar-registrar-lugar', [
    body('_ItemId')
        .notEmpty().withMessage('El item es requerido')
        .isInt().withMessage('El item debe ser un número entero'),
    body('_lugar')
        .notEmpty().withMessage('El lugar es requerido')
        .isString().withMessage('El lugar debe ser una cadena de texto')
        .isLength({ min: 1, max: 200 }).withMessage('El nombre debe tener entre 1 y 200 caracteres'),
], validarErrores,
    checkPermissions.checkPermissions(['Inventario', 'Cambiar ubicacion']),
    ActualizarLugarArticulo.RegistrarLugarArticulo
);

router.post('/registrar-lugar', [
    body('_ubicacion')
        .notEmpty().withMessage('El lugar es requerido')
        .isString().withMessage('El lugar debe ser una cadena de texto')
        .isLength({ min: 1, max: 200 }).withMessage('El lugar debe tener entre 1 y 200 caracteres'),
], validarErrores,
    checkPermissions.checkPermissions(['Inventario']),
    RegistrarItem.RegistrarUbicacion
);

router.post('/registrar-marca', [
    body('_marca')
        .notEmpty().withMessage('La marca es requerido')
        .isString().withMessage('La marca debe ser una cadena de texto')
        .isLength({ min: 1, max: 200 }).withMessage('La marca debe tener entre 1 y 200 caracteres'),
], validarErrores,
    checkPermissions.checkPermissions(['Inventario']),
    RegistrarItem.RegistrarMarca
);

router.post('/registrar-modelo', [
    body('_modelo')
        .notEmpty().withMessage('El modelo es requerido')
        .isString().withMessage('El modelo debe ser una cadena de texto')
        .isLength({ min: 1, max: 250 }).withMessage('El modelo debe tener entre 1 y 250 caracteres'),
], validarErrores,
    checkPermissions.checkPermissions(['Inventario']),
    RegistrarItem.RegistrarModelo
);

router.post('/registrar-cuenta', [
    body('_tipo')
        .notEmpty().withMessage('El tipo es requerido')
        .isString().withMessage('El tipo debe ser una cadena de texto')
        .isLength({ min: 1, max: 250 }).withMessage('El tipo debe tener entre 1 y 250 caracteres'),
], validarErrores,
    checkPermissions.checkPermissions(['Inventario']),
    RegistrarItem.RegistrarCuenta
);

router.post('/registrar-bien', 
    uploadAndParse,[
    body('_subcuenta')
        .optional()
        .isInt().withMessage('La cuenta armonizada debe ser un número entero'),
    body('_descripcion')
        .notEmpty().withMessage('La descripción es requerida')
        .isString().withMessage('La descripción debe ser una cadena de texto')
        .isLength({ min: 1, max: 200 }).withMessage('La descripción debe tener entre 1 y 200 caracteres'),
    body('_codigoPartida')
        .optional()
        .isString().withMessage('El código de partida debe ser una cadena de texto')
        .matches(/^\d+-\d+$/).withMessage("Formato inválido, debe ser números-números (ej. 54332-3253)")
        .isLength({ min: 1 }).withMessage('El código de partida debe tener al menos 1 caracter'),
    body('_numeroInv')
        .notEmpty().withMessage('El numero de inventario es requerido')
        .isInt().withMessage('El numero de inventario debe ser un número entero'),
    body('_observaciones')
        .optional()
        .isString().withMessage('Las observaciones debe ser una cadena de texto')
        .isLength({ min: 1 }).withMessage('Las observaciones deben tener al menos 1 caracter'),
    body('_lugarId')
        .notEmpty().withMessage('El lugar es requerido')
        .isInt().withMessage('El lugar debe ser un número entero'),
    body('_marcaId')
        .optional()
        .isInt().withMessage('La marca debe ser un número entero'),
    body('_modeloId')
        .optional()
        .isInt().withMessage('El modelo debe ser un número entero'),
    body('_numeroSerie')
        .optional()
        .isString().withMessage('El numero de serie debe ser una cadena de texto')
        .isLength({ min: 1, max: 255 }).withMessage('El numero de serie debe tener entre 1 y 255 caracteres'),
    body('_estado')
        .notEmpty().withMessage('El estado es requerido')
        .isString().withMessage('El estado debe ser una cadena de texto')
        .isLength({ min: 1, max: 20 }).withMessage('El estado debe tener entre 1 y 20 caracteres'),
    body('_costoAdquisicion')
        .optional()
        .isFloat({ min: 0, max: 9999999, decimal_digits: '0,2' })
        .withMessage("El precio debe ser un número válido con hasta dos decimales (ej. 100.50)"),
    body('_depreciacion')
        .optional()
        .isFloat({ min: 0, max: 9999999, decimal_digits: '0,2' })
        .withMessage("El precio debe ser un número válido con hasta dos decimales (ej. 100.50)"),
    body('_valorLibros')
        .optional()
        .isFloat({ min: 0, max: 9999999, decimal_digits: '0,2' })
        .withMessage("El precio debe ser un número válido con hasta dos decimales (ej. 100.50)"),
    body('_fechaResguardo')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Formato inválido, la fecha debe ser YYYY-MM-DD (ej. 2026-03-24)"),
    body('_motivoResguardo')
        .optional()
        .isString().withMessage('El motivo de resguardo debe ser una cadena de texto')
        .isLength({ min: 1, max: 250 }).withMessage('El motivo de resguardo debe tener entre 1 y 250 caracteres'),
    body('_departamentoId')
        .optional()
        .isInt().withMessage('El departamento debe ser un número entero'),
    body('_fechaAdquisicion')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Formato inválido, la fecha debe ser YYYY-MM-DD (ej. 2026-03-24)"),
    body('_fechaAlta')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Formato inválido, la fecha debe ser YYYY-MM-DD (ej. 2026-03-24)"),
    body('_cantidad')
        .notEmpty().withMessage('La cantidad es requerido')
        .isInt().withMessage('La cantidad debe ser un número entero'),
    body('_donativo')
        .notEmpty().withMessage('El donativo es requerido')
        .isBoolean().withMessage("Donativo debe ser true o false"),
    body('_cotizacion')
        .optional()
        .isFloat({ min: 0, max: 9999999, decimal_digits: '0,2' })
        .withMessage("El precio debe ser un número válido con hasta dos decimales (ej. 100.50)"),
    body('_cuenta')
        .optional()
        .isString().withMessage('La cuenta debe ser una cadena de texto'),
    body('_vidaUtil')
        .optional()
        .isInt().withMessage('La vida util debe ser un número entero'),
    body('_fechaBaja')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Formato inválido, la fecha debe ser YYYY-MM-DD (ej. 2026-03-24)"),
    body('_tipoBaja')
        .optional()
        .isString().withMessage('El tipo de baja debe ser una cadena de texto')
        .isLength({ min: 1, max: 250 }).withMessage('El tipo de baja debe tener entre 1 y 250 caracteres'),
    body('_fechaPoliza')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Formato inválido, la fecha debe ser YYYY-MM-DD (ej. 2026-03-24)"),
    body('_fechaDocumentoPoliza')
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Formato inválido, la fecha debe ser YYYY-MM-DD (ej. 2026-03-24)"),
    ], validarErrores,
    checkPermissions.checkPermissions(['Inventario']),
    RegistrarItem.RegistrarItem
);

module.exports = router;
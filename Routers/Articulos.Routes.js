const express = require('express');
const router = express.Router();
const { validarErrores } = require('../Utils/expressValidator');
const { body } = require('express-validator');
const checkPermissions = require('../Utils/CheckPermissions');
const ListaArticulos = require('../Controllers/ListaArticulos.controller');
const ObtenerArticulo = require('../Controllers/ObtenerArticulo.controller');
const DeleteArticulo = require('../Controllers/DeleteArticulo.controller');
const AsignarArticulo = require('../Controllers/AsignarArticulo.controller');
const ActualizarLugarArticulo = require('../Controllers/ActualizarLugarArticulo.controller');

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

module.exports = router;
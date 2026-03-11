const express = require('express');
const router = express.Router();
const { validarErrores } = require('../Utils/expressValidator');
const { body } = require('express-validator');
const checkPermissions = require('../Utils/CheckPermissions');
const ListaArticulos = require('../Controllers/ListaArticulos.controller');
const ObtenerArticulo = require('../Controllers/ObtenerArticulo.controller');

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

module.exports = router;
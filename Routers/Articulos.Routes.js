const express = require('express');
const router = express.Router();
const { validarErrores } = require('../Utils/expressValidator');
const { body } = require('express-validator');
const checkPermissions = require('../Utils/CheckPermissions');
const ListaArticulos = require('../Controllers/ListaArticulos.controller');

router.get('/articulos',
    checkPermissions.checkPermissions(['Inventario']),
    ListaArticulos.ListaArticulos
);

module.exports = router;
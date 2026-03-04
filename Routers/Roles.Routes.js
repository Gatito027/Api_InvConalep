const express = require('express');
const router = express.Router();
const { validarErrores } = require('../Utils/expressValidator');
const { body } = require('express-validator');
const checkPermissions = require('../Utils/CheckPermissions');
const ListaRoles = require('../Controllers/ListaRoles.controller');
const CrearRol = require('../Controllers/CrearRol.controller');

router.get('/roles',
    checkPermissions.checkPermissions(['Roles']),
    validarErrores,
    ListaRoles.listaRoles);

router.post('/crear-rol', [
    body('_nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .isLength({ min: 1, max: 100 }).withMessage('El nombre debe tener entre 1 y 100 caracteres'),
    body("_permisos")
        .optional() // el arreglo puede ir vacío o no enviarse
        .isArray().withMessage("Los permisos deben ser un arreglo"),
    body("_permisos.*")
        .isInt().withMessage("Cada permiso debe ser un número entero"),
    ], validarErrores,
    checkPermissions.checkPermissions(['Roles']),
    CrearRol.CrearRol);

module.exports = router;
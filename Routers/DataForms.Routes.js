const express = require('express');
const router = express.Router();
const { validarErrores } = require('../Utils/expressValidator');
const { body } = require('express-validator');
const checkPermissions = require('../Utils/CheckPermissions');
const DataFormsController = require("../Controllers/DataForms.controller");

router.get(
    '/roles',
    checkPermissions.checkPermissions(['Usuarios']),
    DataFormsController.ListaRoles
);

router.get(
    '/areas',
    checkPermissions.checkPermissions(['Usuarios']),
    DataFormsController.ListaAreas
);

router.post(
    '/obtener-rol-usuario',
    [
        body('_usuarioId')
            .notEmpty().withMessage('El usuario es requerido')
            .isInt().withMessage('El usuario debe ser un número entero')
    ],
    validarErrores,
    checkPermissions.checkPermissions(['Usuarios']),
    DataFormsController.ObtenerRolUsuario
);

router.post(
    '/obtener-area-usuario',
    [
        body('_usuarioId')
            .notEmpty().withMessage('El usuario es requerido')
            .isInt().withMessage('El usuario debe ser un número entero')
    ],
    validarErrores,
    checkPermissions.checkPermissions(['Usuarios']),
    DataFormsController.ObtenerAreaUsuario
);

router.get(
    '/permisos',
    checkPermissions.checkPermissions(['Roles']),
    DataFormsController.ObtenerPermisos
);

router.post('/obtener-rol-permisos', [
    body('_rolId')
        .notEmpty().withMessage('El rol es requerido')
        .isInt().withMessage('El rol debe ser un número entero'),
    ], validarErrores,
    checkPermissions.checkPermissions(['Roles']),
    DataFormsController.ObtenerPermisosRol
);

module.exports = router;
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

module.exports = router;
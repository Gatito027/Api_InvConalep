const express = require('express');
const router = express.Router();
const { validarErrores } = require('../Utils/expressValidator');
const { body } = require('express-validator');
const checkPermissions = require('../Utils/CheckPermissions');
const DataFormsController = require("../Controllers/DataForms.controller");
const ItemDataFormsController = require("../Controllers/ItemDataForms.controller");

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

router.get(
    '/usuarios',
    checkPermissions.checkPermissions(['Inventario']),
    DataFormsController.ObtenerPersonas
);

router.post('/Obtener-asignaciones', [
    body('_ItemId')
        .notEmpty().withMessage('El articulo es requerido')
        .isInt().withMessage('El articulo debe ser un número entero'),
    ], validarErrores,
    checkPermissions.checkPermissions(['Inventario', 'Asignar Articulo']),
    DataFormsController.ObtenerItemsAsignados
);

router.get('/lugares',
    checkPermissions.checkPermissions(['Inventario']),
    DataFormsController.ListaLugares
);

router.get('/modelos',
    checkPermissions.checkPermissions(['Inventario']),
    ItemDataFormsController.ListaModelos
);

router.get('/marcas',
    checkPermissions.checkPermissions(['Inventario']),
    ItemDataFormsController.ListaMarcas
);

router.get('/cuentas',
    checkPermissions.checkPermissions(['Inventario']),
    ItemDataFormsController.ListaCuentas
);

module.exports = router;
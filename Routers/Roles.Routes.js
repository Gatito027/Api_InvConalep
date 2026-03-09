const express = require('express');
const router = express.Router();
const { validarErrores } = require('../Utils/expressValidator');
const { body } = require('express-validator');
const checkPermissions = require('../Utils/CheckPermissions');
const ListaRoles = require('../Controllers/ListaRoles.controller');
const CrearRol = require('../Controllers/CrearRol.controller');
const ObtenerRol = require('../Controllers/ObtenerRol.controller');
const DeleteRol = require('../Controllers/DeleteRol.controller');
const EditarRol = require('../Controllers/EditarRol.controller');

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
    checkPermissions.checkPermissions(['Roles', 'Crear rol']),
    CrearRol.CrearRol);

router.post('/ver-rol', [
    body('_rolId')
        .notEmpty().withMessage('El rol es requerido')
        .isInt().withMessage('El rol debe ser un número entero'),
], validarErrores,
    checkPermissions.checkPermissions(['Roles', 'Detalles rol']),
    ObtenerRol.ObtenerRol);

router.delete('/eliminar-rol', [
    body('_rolId')
        .notEmpty().withMessage('El rol es requerido')
        .isInt().withMessage('El rol debe ser un número entero'),],
    checkPermissions.checkPermissions(['Roles', 'Eliminar rol']),
    validarErrores,
    DeleteRol.DeleteRol);

router.put('/editar-rol', [
    body('_rolId')
        .notEmpty().withMessage('El rol es requerido')
        .isInt().withMessage('El rol debe ser un número entero'),
    body('_nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .isLength({ min: 1, max: 100 }).withMessage('El nombre debe tener entre 1 y 100 caracteres'),
    body("_permisos")
        .optional() // el arreglo puede ir vacío o no enviarse
        .isArray().withMessage("Los permisos deben ser un arreglo"),
    body("_permisos.*")
        .isInt().withMessage("Cada permiso debe ser un número entero"),
    ],
    validarErrores,
    checkPermissions.checkPermissions(['Roles', 'Editar rol']),
    EditarRol.EditarRol);

module.exports = router;
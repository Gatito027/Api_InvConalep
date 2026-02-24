const express = require('express');
const router = express.Router();
const loginLimiter = require('../Utils/rateLimiter');
const { body } = require('express-validator');
const checkPermissions = require('../Utils/CheckPermissions');
const { validarErrores } = require('../Utils/expressValidator');
const registerController = require('../Controllers/Register.controller');
const loginController = require('../Controllers/Login.controller');
const profileController = require('../Controllers/Profile.controller');
const logoutController = require('../Controllers/Logout.controller');
const listaController = require('../Controllers/ListaUsuarios.controller');
const registrarAreaController = require('../Controllers/RegistrarArea.controller');
const DeleteUsuario = require('../Controllers/DeleteUsuario.controller');
const ObtenerUsuario = require('../Controllers/ObtenerUsuario.controller');
const ActualizarPasswordAdmin = require('../Controllers/ActualizarPasswordAdmin.controller');
const ActualizarRol = require('../Controllers/ActualizarRol.controller');
const ActualizarArea = require('../Controllers/ActualizarArea.controller');

//* Rutas del proyecto
router.post('/registrar-usuario', [
  body('_usuario')
    .notEmpty().withMessage('El nombre de usuario es requerido')
    .isString().withMessage('El usuario debe ser una cadena de texto')
    .isLength({ min: 3, max: 100 }).withMessage('El usuario debe tener entre 3 y 100 caracteres'),

  body('_nombre')
    .notEmpty().withMessage('El nombre completo es requerido')
    .isString().withMessage('El nombre debe ser una cadena de texto')
    .isLength({ min: 3, max: 150 }).withMessage('El nombre debe tener entre 3 y 150 caracteres'),

  body('_area')
    .notEmpty().withMessage('El área es requerida')
    .isInt().withMessage('El área debe ser un número entero'),

  body('_rol')
    .notEmpty().withMessage('El rol es requerido')
    .isInt().withMessage('El rol debe ser un número entero'),

  body('_password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isString().withMessage('La contraseña debe ser una cadena de texto')
    .isLength({ min: 8, max: 100 }).withMessage('La contraseña debe tener entre 8 y 100 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[@$!%*?&]/).withMessage('La contraseña debe contener al menos un carácter especial (@$!%*?&)')
],
  validarErrores,
  registerController.register
);

router.post('/login', [
  body('_usuario')
    .notEmpty().withMessage('El nombre de usuario es requerido')
    .isString().withMessage('El usuario debe ser una cadena de texto'),

  body('_password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isString().withMessage('La contraseña debe ser una cadena de texto')
], validarErrores, loginLimiter, loginController.login);

router.get('/profile', profileController.profile);

router.post('/logout', logoutController.logout);

router.get('/usuarios', checkPermissions.checkPermissions(['Usuarios']), validarErrores, listaController.listaUsuarios);

router.post('/resgistrar_area', [
  body('_area')
    .notEmpty().withMessage('El area es requerida')
    .isString().withMessage('El area debe ser una cadena de texto')
    .isLength({ min: 2, max: 255 }).withMessage('El area debe tener entre 2 y 255 caracteres')], validarErrores,
  checkPermissions.checkPermissions(['Usuarios', 'Registrar Usuarios']),
  registrarAreaController.RegistrarArea);

router.delete('/eliminar-usuario', [
  body('_usuarioId')
    .notEmpty().withMessage('El usuario es requerido')
    .isInt().withMessage('El usuario debe ser un número entero'),],
    checkPermissions.checkPermissions(['Usuarios', 'Eliminar Usuario']),
    validarErrores,
    DeleteUsuario.DeleteUsuario);

router.post('/obtener-usuario', [
  body('_usuarioId')
    .notEmpty().withMessage('El usuario es requerido')
    .isInt().withMessage('El usuario debe ser un número entero'),
], validarErrores, checkPermissions.checkPermissions(['Usuarios', 'Detalles Usuario']),
ObtenerUsuario.ObtenerUsuario
);

router.post('/cambiar-password', [
  body('_usuarioId')
    .notEmpty().withMessage('El usuario es requerido')
    .isInt().withMessage('El usuario debe ser un número entero'),
  body('_password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isString().withMessage('La contraseña debe ser una cadena de texto')
    .isLength({ min: 8, max: 100 }).withMessage('La contraseña debe tener entre 8 y 100 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[@$!%*?&]/).withMessage('La contraseña debe contener al menos un carácter especial (@$!%*?&)')
], validarErrores, checkPermissions.checkPermissions(['Usuarios', 'Cambiar contraseñas']),
ActualizarPasswordAdmin.ActualizarPasswordAdmin);

router.post('/cambiar-rol', [
  body('_usuarioId')
    .notEmpty().withMessage('El usuario es requerido')
    .isInt().withMessage('El usuario debe ser un número entero'),
  body('_rol')
    .notEmpty().withMessage('El rol es requerido')
    .isInt().withMessage('El rol debe ser un número entero')
], validarErrores, checkPermissions.checkPermissions(['Usuarios', 'Cambiar rol']),
ActualizarRol.ActualizarRol);

router.post('/cambiar-area', [
  body('_usuarioId')
    .notEmpty().withMessage('El usuario es requerido')
    .isInt().withMessage('El usuario debe ser un número entero'),
  body('_area')
    .notEmpty().withMessage('El area es requerida')
    .isInt().withMessage('El area debe ser un número entero')
], validarErrores, checkPermissions.checkPermissions(['Usuarios', 'Cambiar area']),
ActualizarArea.ActualizarArea);

module.exports = router;
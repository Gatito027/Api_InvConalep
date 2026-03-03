const express = require('express');
const router = express.Router();
const { validarErrores } = require('../Utils/expressValidator');
const { body } = require('express-validator');
const checkPermissions = require('../Utils/CheckPermissions');
const ListaRoles = require('../Controllers/ListaRoles.controller');

router.get('/roles', 
    checkPermissions.checkPermissions(['Roles']), 
    validarErrores, 
    ListaRoles.listaRoles);

module.exports = router;
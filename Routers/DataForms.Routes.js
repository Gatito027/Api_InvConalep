const express = require('express');
const router = express.Router();

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

module.exports = router;
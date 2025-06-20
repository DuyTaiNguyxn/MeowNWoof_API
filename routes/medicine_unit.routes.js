// routes/medicine_unit.routes.js
const express = require('express');
const router = express.Router();
const unitController = require('../controllers/medicine_unit.controller');

router.get('/', unitController.getAllUnits);
router.get('/:id', unitController.getUnitById);

module.exports = router;
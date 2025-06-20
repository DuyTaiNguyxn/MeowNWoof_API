// routes/medicine.routes.js
const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicine.controller');

router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicineById);

module.exports = router;
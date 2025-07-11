// routes/prescription.routes.js
const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescription.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', prescriptionController.getAllPrescriptions);

router.get('/:id', prescriptionController.getPrescriptionByRecordId);

router.post('/', authMiddleware.verifyToken, prescriptionController.createPrescription);

router.put('/:id', authMiddleware.verifyToken, prescriptionController.updatePrescription);

router.delete('/:id', authMiddleware.verifyToken, prescriptionController.deletePrescription);

router.delete('/:id/items', authMiddleware.verifyToken, prescriptionController.deleteItem);

module.exports = router;
// routes/medical_record.routes.js
const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medical_record.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', medicalRecordController.getAllMedicalRecords);

router.get('/:id', medicalRecordController.getMedicalRecordById);

router.post('/', authMiddleware.verifyToken, medicalRecordController.createMedicalRecord);

router.put('/:id', authMiddleware.verifyToken, medicalRecordController.updateMedicalRecord);

router.delete('/:id', authMiddleware.verifyToken, medicalRecordController.deleteMedicalRecord);

router.get('/pet/:petId', medicalRecordController.getMedicalRecordsByPetId);

router.get('/veterinarian/:veterinarianId', medicalRecordController.getMedicalRecordsByVeterinarianId);

module.exports = router;
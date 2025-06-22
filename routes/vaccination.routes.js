// routes/vaccination.routes.js
const express = require('express');
const router = express.Router();
const vaccinationController = require('../controllers/vaccination.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', vaccinationController.getAllVaccinations);

router.get('/:id', vaccinationController.getVaccinationById);

router.post('/', authMiddleware.verifyToken, vaccinationController.createVaccination);

router.put('/:id', authMiddleware.verifyToken, vaccinationController.updateVaccination);

router.put('/status/:id', authMiddleware.verifyToken, vaccinationController.updateVaccinationStatus);

router.delete('/:id', authMiddleware.verifyToken, vaccinationController.deleteVaccination);

module.exports = router;
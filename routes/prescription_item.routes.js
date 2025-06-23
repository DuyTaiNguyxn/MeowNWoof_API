const express = require('express');
const router = express.Router();
const prescriptionItemController = require('../controllers/prescription_item.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', prescriptionItemController.getAll);

router.get('/:id', prescriptionItemController.getById);

router.get('/prescription/:prescriptionId', prescriptionItemController.getByPrescriptionId);

router.post('/', authMiddleware.verifyToken, prescriptionItemController.create);

router.put('/:id', authMiddleware.verifyToken, prescriptionItemController.update);

router.delete('/:id', authMiddleware.verifyToken, prescriptionItemController.remove);

module.exports = router;
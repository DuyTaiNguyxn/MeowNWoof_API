// routes/appointment.routes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', appointmentController.getAllAppointments);

router.get('/:id', appointmentController.getAppointmentById);

router.post('/', authMiddleware.verifyToken, appointmentController.createAppointment);

router.put('/:id', authMiddleware.verifyToken, appointmentController.updateAppointment);

router.put('/status/:id', authMiddleware.verifyToken, appointmentController.updateAppointmentStatus);

router.delete('/:id', authMiddleware.verifyToken, appointmentController.deleteAppointment);

module.exports = router;
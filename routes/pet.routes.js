// routes/pet.routes.js
const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', petController.getAllPets);

router.get('/:id', petController.getPetById);

router.post('/', authMiddleware.verifyToken, petController.createPet);

router.put('/:id', authMiddleware.verifyToken, petController.updatePet);

router.delete('/:id', authMiddleware.verifyToken, petController.deletePet);

module.exports = router;
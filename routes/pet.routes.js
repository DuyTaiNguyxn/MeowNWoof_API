// routes/pet.routes.js
const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Lấy tất cả thú cưng
router.get('/', petController.getAllPets);

// Lấy thú cưng theo ID
router.get('/:id', petController.getPetById);

// Tạo thú cưng mới (yêu cầu xác thực)
router.post('/', authMiddleware.verifyToken, petController.createPet);

// Cập nhật thú cưng theo ID (yêu cầu xác thực)
router.put('/:id', authMiddleware.verifyToken, petController.updatePet);

// Xóa thú cưng theo ID (yêu cầu xác thực)
router.delete('/:id', authMiddleware.verifyToken, petController.deletePet);

module.exports = router;
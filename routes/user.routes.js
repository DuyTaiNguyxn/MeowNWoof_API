// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Import middleware xác thực

// --- CÁC ROUTE CẦN BẢO VỆ VÀ PHÂN QUYỀN ---

// Lấy tất cả user: Bất kỳ user nào đã đăng nhập cũng có thể xem danh sách
router.get('/', authMiddleware.verifyToken, userController.getAllUsers);

// Lấy thông tin user theo ID: User có thể xem của chính mình, Admin có thể xem bất kỳ ai
router.get('/:id', authMiddleware.verifyToken, userController.getUserById);

// Tạo user mới (đăng ký nhân viên): CHỈ ADMIN MỚI ĐƯỢC THÊM
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.createUser);

// Cập nhật user: User có thể cập nhật của chính mình, Admin có thể cập nhật bất kỳ ai
router.put('/:id', authMiddleware.verifyToken, userController.updateUser);

// Xóa user: CHỈ ADMIN MỚI ĐƯỢC XÓA
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;
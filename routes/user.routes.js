// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Import middleware xác thực

router.get('/', authMiddleware.verifyToken, userController.getAllUsers);

router.get('/:id', authMiddleware.verifyToken, userController.getUserById);

router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.createUser);

router.put('/:id', authMiddleware.verifyToken, userController.updateUser);

router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;
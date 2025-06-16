// routes/owner.routes.js
const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Để bảo vệ API

router.get('/', ownerController.getAllPetOwners);

// Ví dụ: Lấy owner theo ID
router.get('/:id', ownerController.getPetOwnerById);

// Ví dụ: Tạo owner mới (chỉ admin mới được tạo)
//router.post('/', authMiddleware.verifyToken, ownerController.createPetOwner);

// ... Thêm các route khác (PUT, DELETE) nếu cần, và bảo vệ chúng với middleware tương ứng
// router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, ownerController.updatePetOwner);
// router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, ownerController.deletePetOwner);

module.exports = router;
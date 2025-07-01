// routes/owner.routes.js
const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Để bảo vệ API

router.get('/', ownerController.getAllPetOwners);

router.get('/:id', ownerController.getPetOwnerById);


module.exports = router;
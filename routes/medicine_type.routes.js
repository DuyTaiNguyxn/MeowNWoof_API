// routes/medicine_type.routes.js
const express = require('express');
const router = express.Router();
const typeController = require('../controllers/medicine_type.controller');

router.get('/', typeController.getAllTypes);
router.get('/:id', typeController.getTypeById);

module.exports = router;
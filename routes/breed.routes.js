// routes/breed.routes.js
const express = require('express');
const router = express.Router();
const breedController = require('../controllers/breed.controller');

router.get('/', breedController.getAllBreeds);
router.get('/:id', breedController.getBreedById);
router.get('/by-species/:speciesId', breedController.getBreedsBySpeciesId);

module.exports = router;
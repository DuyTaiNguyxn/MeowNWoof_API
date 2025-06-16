// controllers/breed.controller.js
const Breed = require('../models/breed.model');

exports.getAllBreeds = async (req, res) => {
    try {
        const breeds = await Breed.getAll();
        res.status(200).json(breeds);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách giống:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách giống' });
    }
};

exports.getBreedById = async (req, res) => {
    try {
        const breedId = parseInt(req.params.id);
        if (isNaN(breedId)) {
            return res.status(400).json({ message: 'ID giống không hợp lệ.' });
        }

        const breed = await Breed.getById(breedId);
        if (!breed) {
            return res.status(404).json({ message: 'Không tìm thấy giống.' });
        }
        res.status(200).json(breed);
    } catch (error) {
        console.error('Lỗi khi lấy giống theo ID:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy giống' });
    }
};

exports.getBreedsBySpeciesId = async (req, res) => {
    try {
        const speciesId = parseInt(req.params.speciesId); // Chuyển sang số nguyên
        if (isNaN(speciesId)) {
            return res.status(400).json({ message: 'ID loài không hợp lệ' });
        }
        const breeds = await Breed.findBySpeciesId(speciesId);
        res.status(200).json(breeds);
    } catch (error) {
        console.error('Lỗi khi lấy giống theo loài:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy giống theo loài' });
    }
};
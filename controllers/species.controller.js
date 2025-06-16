// controllers/species.controller.js
const Species = require('../models/species.model');

exports.getAllSpecies = async (req, res) => {
    try {
        const species = await Species.getAll();
        res.status(200).json(species);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách loài:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách loài' });
    }
};

exports.getSpeciesById = async (req, res) => {
    try {
        const speciesId = parseInt(req.params.id);
        if (isNaN(speciesId)) {
            return res.status(400).json({ message: 'ID loài không hợp lệ.' });
        }

        const species = await Species.getById(speciesId);
        if (!species) {
            return res.status(404).json({ message: 'Không tìm thấy loài.' });
        }
        res.status(200).json(species);
    } catch (error) {
        console.error('Lỗi khi lấy loài theo ID:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy loài' });
    }
};
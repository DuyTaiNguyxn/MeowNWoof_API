// controllers/pet.controller.js

const Pet = require('../models/pet.model');
const PetOwner = require('../models/owner.model');

exports.getAllPets = async (req, res) => {
    try {
        const pets = await Pet.findAll();
        res.json(pets);
    } catch (err) {
        console.error('Error fetching all pets:', err);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách pets.', error: err.message });
    }
};

exports.getPetById = async (req, res) => {
    const { id } = req.params;
    try {
        const pet = await Pet.findById(id);
        if (!pet) {
            return res.status(404).json({ message: 'Không tìm thấy pet.' });
        }
        res.json(pet);
    } catch (err) {
        console.error(`Error fetching pet with ID ${id}:`, err);
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin pet.', error: err.message });
    }
};

exports.createPet = async (req, res) => {
    const petData = req.body; 

    try {
        const createdPet = await Pet.create(petData);

        res.status(201).json(createdPet);
    } catch (err) {
        console.error('Error creating pet:', err);
        res.status(err.message.includes('bắt buộc') ? 400 : 500).json({ message: err.message || 'Lỗi server khi tạo pet.' });
    }
};

exports.updatePet = async (req, res) => {
    const { id } = req.params;
    const petData = req.body;

    console.log('Controller received pet data:', req.body);

    try {
        const updatedPet = await Pet.update(id, petData);

        if (updatedPet) {
            res.status(200).json(updatedPet);
        } else {
            res.status(404).json({ message: 'Không tìm thấy pet để cập nhật hoặc không có gì thay đổi.' });
        }
    } catch (err) {
        console.error(`Error updating pet with ID ${id}:`, err);
        res.status(500).json({ message: 'Lỗi server khi cập nhật pet.', error: err.message });
    }
};

exports.deletePet = async (req, res) => {
    const { id } = req.params;

    try {
        const success = await Pet.delete(id);
        if (success) {
            res.status(200).json({ message: 'Xóa pet thành công.' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy pet để xóa.' });
        }
    } catch (err) {
        console.error(`Error deleting pet with ID ${id}:`, err);
        res.status(500).json({ message: 'Lỗi server khi xóa pet.', error: err.message });
    }
};
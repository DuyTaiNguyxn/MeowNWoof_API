// controllers/owner.controller.js

const PetOwner = require('../models/owner.model');

exports.getAllPetOwners = async (req, res) => {
  try {
    const owners = await PetOwner.findAll();
    res.json(owners);
  } catch (err) {
    console.error('Error fetching all owners:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách owners.' });
  }
};

exports.getPetOwnerById = async (req, res) => {
  const { id } = req.params;
  try {
    const owner = await PetOwner.findById(id);
    if (!owner) {
      return res.status(404).json({ message: 'Không tìm thấy owner.' });
    }
    res.json(owner);
  } catch (err) {
    console.error(`Error fetching owner with ID ${id}:`, err);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin owner.' });
  }
};

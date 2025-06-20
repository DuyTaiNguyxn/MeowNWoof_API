// controllers/medicine_type.controller.js
const MedicineType = require('../models/medicine_type.model');

exports.getAllTypes = async (req, res) => {
    try {
        const medicine_types = await MedicineType.getAll();
        res.status(200).json(medicine_types);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách loại thuốc:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách loại thuốc' });
    }
};

exports.getTypeById = async (req, res) => {
    try {
        const medicine_typeId = parseInt(req.params.id);
        if (isNaN(medicine_typeId)) {
            return res.status(400).json({ message: 'ID loại thuốc không hợp lệ.' });
        }

        const medicine_type = await MedicineType.getById(medicine_typeId);
        if (!medicine_type) {
            return res.status(404).json({ message: 'Không tìm thấy loại thuốc.' });
        }
        res.status(200).json(medicine_type);
    } catch (error) {
        console.error('Lỗi khi lấy loại thuốc theo ID:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy loại thuốc' });
    }
};
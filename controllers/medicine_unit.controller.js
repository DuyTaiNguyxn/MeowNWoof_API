// controllers/medicine_unit.controller.js
const MedicineUnit = require('../models/medicine_unit.model');

exports.getAllUnits = async (req, res) => {
    try {
        const medicine_units = await MedicineUnit.getAll();
        res.status(200).json(medicine_units);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách loại thuốc:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách loại thuốc' });
    }
};

exports.getUnitById = async (req, res) => {
    try {
        const medicine_unitId = parseInt(req.params.id);
        if (isNaN(medicine_unitId)) {
            return res.status(400).json({ message: 'ID loại thuốc không hợp lệ.' });
        }

        const medicine_unit = await MedicineUnit.getById(medicine_unitId);
        if (!medicine_unit) {
            return res.status(404).json({ message: 'Không tìm thấy loại thuốc.' });
        }
        res.status(200).json(medicine_unit);
    } catch (error) {
        console.error('Lỗi khi lấy loại thuốc theo ID:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy loại thuốc' });
    }
};
// controllers/medicine.controller.js
const Medicine = require('../models/medicine.model');

exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.getAll();
        res.status(200).json(medicines);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thuốc:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách thuốc' });
    }
};

exports.getMedicineById = async (req, res) => {
    try {
        const medicineId = parseInt(req.params.id);
        if (isNaN(medicineId)) {
            return res.status(400).json({ message: 'ID thuốc không hợp lệ.' });
        }

        const medicine = await Medicine.getById(medicineId);
        if (!medicine) {
            return res.status(404).json({ message: 'Không tìm thấy thuốc.' });
        }
        res.status(200).json(medicine);
    } catch (error) {
        console.error('Lỗi khi lấy thuốc theo ID:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy thuốc' });
    }
};
const Prescription = require('../models/prescription.model');

exports.createPrescription = async (req, res) => {
    try {
        const newPrescription = new Prescription(req.body);
        if (!newPrescription.medical_record_id || !newPrescription.veterinarian_id) {
            return res.status(400).send({ message: 'Vui lòng cung cấp medical_record_id và veterinarian_id.' });
        }
        const prescription = await Prescription.create(newPrescription);
        res.status(201).send(prescription);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Đã xảy ra lỗi khi tạo đơn thuốc.' });
    }
};

exports.getAllPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.getAll();
        res.status(200).send(prescriptions);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Đã xảy ra lỗi khi lấy danh sách đơn thuốc.' });
    }
};

exports.getPrescriptionByRecordId = async (req, res) => {
    try {
        const prescription = await Prescription.getByRecordId(req.params.id);
        if (!prescription) {
            return res.status(404).send({ message: `Không tìm thấy đơn thuốc với id: ${req.params.id}.` });
        }
        res.status(200).send(prescription);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Đã xảy ra lỗi khi lấy đơn thuốc.' });
    }
};

exports.updatePrescription = async (req, res) => {
    try {
        const updatedPrescription = new Prescription(req.body);
        if (!req.body.medical_record_id || !req.body.veterinarian_id) {
            return res.status(400).send({ message: 'Vui lòng cung cấp medical_record_id và veterinarian_id để cập nhật.' });
        }
        const result = await Prescription.updateById(req.params.id, updatedPrescription);
        if (!result) {
            return res.status(404).send({ message: `Không tìm thấy đơn thuốc với id: ${req.params.id} để cập nhật.` });
        }
        res.status(200).send({ message: 'Cập nhật đơn thuốc thành công!', updated: result });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Đã xảy ra lỗi khi cập nhật đơn thuốc.' });
    }
};
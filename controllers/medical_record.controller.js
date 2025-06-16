// controllers/medicalRecordController.js
const MedicalRecord = require('../models/medical_record.model');

exports.createMedicalRecord = async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào cần thiết tối thiểu
        const { pet_id, record_date, symptoms, preliminary_diagnosis, veterinarian_id } = req.body;
        if (!pet_id || !record_date || !symptoms || !preliminary_diagnosis || !veterinarian_id) {
            return res.status(400).json({ message: 'Missing required fields: pet_id, record_date, symptoms, preliminary_diagnosis, veterinarian_id' });
        }

        const newRecordData = {
            pet_id: pet_id,
            record_date: record_date,
            symptoms: symptoms,
            preliminary_diagnosis: preliminary_diagnosis,
            final_diagnosis: req.body.final_diagnosis || null,
            treatment_method: req.body.treatment_method || null,
            veterinarian_id: veterinarian_id,
            veterinarian_note: req.body.veterinarian_note || null,
        };

        const newRecord = await MedicalRecord.create(newRecordData);

        if (newRecord) {
            res.status(201).json({
                message: 'Hồ sơ bệnh án được tạo thành công!',
                data: newRecord
            });
        } else {
            res.status(500).json({ message: 'Không thể tạo hồ sơ bệnh án.' });
        }
    } catch (error) {
        console.error("Lỗi khi tạo hồ sơ bệnh án:", error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tạo hồ sơ bệnh án.', error: error.message });
    }
};

exports.getAllMedicalRecords = async (req, res) => {
    try {
        const records = await MedicalRecord.findAll();
        res.status(200).json({
            message: 'Danh sách hồ sơ bệnh án',
            count: records.length,
            data: records
        });
    } catch (error) {
        console.error("Lỗi khi lấy tất cả hồ sơ bệnh án:", error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy hồ sơ bệnh án.', error: error.message });
    }
};

exports.getMedicalRecordById = async (req, res) => {
    try {
        const recordId = req.params.id;
        const record = await MedicalRecord.findById(recordId);

        if (record) {
            res.status(200).json({
                message: `Hồ sơ bệnh án với ID ${recordId}`,
                data: record
            });
        } else {
            res.status(404).json({ message: `Không tìm thấy hồ sơ bệnh án với ID ${recordId}.` });
        }
    } catch (error) {
        console.error(`Lỗi khi lấy hồ sơ bệnh án với ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy hồ sơ bệnh án.', error: error.message });
    }
};

exports.updateMedicalRecord = async (req, res) => {
    try {
        const recordId = req.params.id;
        const updatedData = req.body;

        const success = await MedicalRecord.update(recordId, updatedData);

        if (success) {
            // Lấy lại bản ghi đã cập nhật để gửi về client
            const updatedRecord = await MedicalRecord.findById(recordId);
            res.status(200).json({
                message: `Hồ sơ bệnh án với ID ${recordId} đã được cập nhật thành công!`,
                data: updatedRecord
            });
        } else {
            res.status(404).json({ message: `Không tìm thấy hồ sơ bệnh án với ID ${recordId} để cập nhật hoặc không có gì thay đổi.` });
        }
    } catch (error) {
        console.error(`Lỗi khi cập nhật hồ sơ bệnh án với ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật hồ sơ bệnh án.', error: error.message });
    }
};

exports.deleteMedicalRecord = async (req, res) => {
    try {
        const recordId = req.params.id;

        // Tương tự, có thể thêm kiểm tra quyền ở đây

        const success = await MedicalRecord.delete(recordId);

        if (success) {
            res.status(200).json({ message: `Hồ sơ bệnh án với ID ${recordId} đã được xóa thành công!` });
        } else {
            res.status(404).json({ message: `Không tìm thấy hồ sơ bệnh án với ID ${recordId} để xóa.` });
        }
    } catch (error) {
        console.error(`Lỗi khi xóa hồ sơ bệnh án với ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi xóa hồ sơ bệnh án.', error: error.message });
    }
};

exports.getMedicalRecordsByPetId = async (req, res) => {
    try {
        const petId = req.params.petId;
        const records = await MedicalRecord.findByPetId(petId);

        if (records.length > 0) {
            res.status(200).json({
                message: `Hồ sơ bệnh án cho thú cưng với ID ${petId}`,
                count: records.length,
                data: records
            });
        } else {
            res.status(404).json({ message: `Không tìm thấy hồ sơ bệnh án nào cho thú cưng với ID ${petId}.` });
        }
    } catch (error) {
        console.error(`Lỗi khi lấy hồ sơ bệnh án cho thú cưng với ID ${req.params.petId}:`, error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy hồ sơ bệnh án cho thú cưng.', error: error.message });
    }
};

exports.getMedicalRecordsByVeterinarianId = async (req, res) => {
    try {
        const veterinarianId = req.params.veterinarianId;
        const records = await MedicalRecord.findByVeterinarianId(veterinarianId);

        if (records.length > 0) {
            res.status(200).json({
                message: `Hồ sơ bệnh án được tạo bởi bác sĩ thú y với ID ${veterinarianId}`,
                count: records.length,
                data: records
            });
        } else {
            res.status(404).json({ message: `Không tìm thấy hồ sơ bệnh án nào được tạo bởi bác sĩ thú y với ID ${veterinarianId}.` });
        }
    } catch (error) {
        console.error(`Lỗi khi lấy hồ sơ bệnh án của bác sĩ thú y với ID ${req.params.veterinarianId}:`, error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy hồ sơ bệnh án của bác sĩ thú y.', error: error.message });
    }
};
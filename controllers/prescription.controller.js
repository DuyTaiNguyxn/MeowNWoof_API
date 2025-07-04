const Prescription = require('../models/prescription.model');

exports.createPrescription = async (req, res) => {
    try {
        const newPrescription = new Prescription(req.body);
        console.log('Thông tin đơn thuốc mới nhận được:', newPrescription);

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
        const { veterinarian_note, prescription_date } = req.body;

        if (veterinarian_note === undefined && prescription_date === undefined) {
            return res.status(400).send({ message: 'Vui lòng cung cấp ít nhất một trường để cập nhật.' });
        }

        const updatedPrescription = {
            veterinarian_note,
            prescription_date
        };

        const result = await Prescription.updateById(req.params.id, updatedPrescription);

        console.log('[PreController] Update result:', result);

        if (!result) {
            return res.status(404).send({ message: `Không tìm thấy đơn thuốc với id: ${req.params.id} để cập nhật.` });
        }

        res.status(200).send(result);

    } catch (error) {
        res.status(500).send({ message: error.message || 'Đã xảy ra lỗi khi cập nhật đơn thuốc.' });
    }
};

exports.deleteItem = async (req, res) => {
    const prescriptionId = req.params.id;

    try {
        const deletedItemsCount = await Prescription.deleteItemsByPrescriptionId(prescriptionId);

        res.status(200).send({
            message: `Đã xoá ${deletedItemsCount} thuốc khỏi đơn thuốc.`,
            deletedCount: deletedItemsCount,
        });
    } catch (error) {
        console.error('[PrescriptionController] Lỗi khi xoá thuốc:', error);
        res.status(500).send({
            message: 'Đã xảy ra lỗi khi xoá các thuốc khỏi đơn thuốc.',
        });
    }
};

exports.deletePrescription = async (req, res) => {
    const prescriptionId = req.params.id;

    try {
        await Prescription.deletePrescription(prescriptionId);

        res.status(200).send({
            message: `Đã xoá ghi chú đơn thuốc.`
        });
    } catch (error) {
        res.status(500).send({
            message: 'Đã xảy ra lỗi khi xoá note đơn thuốc.',
        });
    }
};

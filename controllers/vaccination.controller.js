// controllers/vaccinationController.js
const Vaccination = require('../models/vaccination.model');
const { format } = require('date-fns');

exports.createVaccination = async (req, res) => {
  try {
    const { pet_id, vaccination_datetime, disease_prevented, vaccine_id, employee_id, status } = req.body;

    if (!pet_id || !vaccination_datetime || !disease_prevented || !vaccine_id || !employee_id || !status) {
      return res.status(400).json({ message: 'Thiếu các trường bắt buộc: pet_id, vaccination_datetime, disease_prevented, vaccine_id, employee_id, status' });
    }

    const formattedDatetime = format(new Date(vaccination_datetime), 'yyyy-MM-dd HH:mm:ss');

    const newVaccinationData = {
      pet_id: pet_id,
      vaccination_datetime: formattedDatetime,
      disease_prevented: disease_prevented,
      vaccine_id: vaccine_id,
      employee_id: employee_id,
      status: status,
    };

    const newVaccination = await Vaccination.create(newVaccinationData);
    if (newVaccination) {
      res.status(201).json({
        message: 'Lịch tiêm chủng được tạo thành công!',
        data: newVaccination
      });
    } else {
      console.error("Tạo lịch tiêm chủng thất bại, newVaccination là null.");
      res.status(500).json({ message: 'Không thể tạo lịch tiêm chủng.' });
    }
  } catch (error) {
    console.error("Lỗi khi tạo lịch tiêm chủng:", error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tạo lịch tiêm chủng.', error: error.message });
  }
};

exports.getAllVaccinations = async (req, res) => {
  try {
    const vaccinations = await Vaccination.findAll();
    res.status(200).json({
      message: 'Danh sách lịch tiêm chủng',
      count: vaccinations.length,
      data: vaccinations
    });
  } catch (error) {
    console.error("Lỗi khi lấy tất cả lịch tiêm chủng:", error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy danh sách lịch tiêm chủng.', error: error.message });
  }
};

exports.getVaccinationById = async (req, res) => {
  try {
    const vaccinationId = req.params.id;
    const vaccination = await Vaccination.findById(vaccinationId);

    if (vaccination) {
      res.status(200).json({
        message: `Lịch tiêm chủng với ID ${vaccinationId}`,
        data: vaccination
      });
    } else {
      res.status(404).json({ message: `Không tìm thấy lịch tiêm chủng với ID ${vaccinationId}.` });
    }
  } catch (error) {
    console.error(`Lỗi khi lấy lịch tiêm chủng với ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy lịch tiêm chủng.', error: error.message });
  }
};

exports.updateVaccination = async (req, res) => {
  try {
    const vaccinationId = req.params.id;
    const updatedData = req.body;

    if (updatedData.vaccination_datetime) {
      updatedData.vaccination_datetime = format(new Date(updatedData.vaccination_datetime), 'yyyy-MM-dd HH:mm:ss');
    }

    const success = await Vaccination.update(vaccinationId, updatedData);

    if (success) {
      const updatedVaccination = await Vaccination.findById(vaccinationId);
      res.status(200).json({
        message: `Lịch tiêm chủng với ID ${vaccinationId} đã được cập nhật thành công!`,
        data: updatedVaccination
      });
    } else {
      res.status(404).json({ message: `Không tìm thấy lịch tiêm chủng với ID ${vaccinationId} để cập nhật hoặc không có gì thay đổi.` });
    }
  } catch (error) {
    console.error(`Lỗi khi cập nhật lịch tiêm chủng với ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật lịch tiêm chủng.', error: error.message });
  }
};

exports.deleteVaccination = async (req, res) => {
  try {
    const vaccinationId = req.params.id;

    const success = await Vaccination.delete(vaccinationId);

    if (success) {
      res.status(200).json({ message: `Lịch tiêm chủng với ID ${vaccinationId} đã được xóa thành công!` });
    } else {
      res.status(404).json({ message: `Không tìm thấy lịch tiêm chủng với ID ${vaccinationId} để xóa.` });
    }
  } catch (error) {
    console.error(`Lỗi khi xóa lịch tiêm chủng với ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi xóa lịch tiêm chủng.', error: error.message });
  }
};

exports.updateVaccinationStatus = async (req, res) => {
  try {
    const vaccinationId = req.params.id;
    const { status: newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({ message: 'Trạng thái mới không được cung cấp.' });
    }

    const success = await Vaccination.setStatus(vaccinationId, newStatus);

    if (success) {
      const updatedVaccination = await Vaccination.findById(vaccinationId);
      res.status(200).json({
        message: `Trạng thái lịch tiêm chủng với ID ${vaccinationId} đã được cập nhật thành công!`,
        data: updatedVaccination
      });
    } else {
      res.status(404).json({ message: `Không tìm thấy lịch tiêm chủng với ID ${vaccinationId} để cập nhật trạng thái hoặc trạng thái không thay đổi.` });
    }
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái lịch tiêm chủng với ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật trạng thái lịch tiêm chủng.', error: error.message });
  }
};

// controllers/appointmentController.js
const Appointment = require('../models/appointment.model');
const { format } = require('date-fns');

exports.createAppointment = async (req, res) => {
  try {
    const { pet_id, appointment_datetime, employee_id, veterinarian_id, status } = req.body;
    if (!pet_id || !appointment_datetime || !employee_id || !veterinarian_id || !status) {
      return res.status(400).json({ message: 'Missing required fields: pet_id, appointment_datetime, employee_id, veterinarian_id, status' });
    }

    // Đảm bảo định dạng ngày giờ phù hợp với CSDL
    const formattedDatetime = format(new Date(appointment_datetime), 'yyyy-MM-dd HH:mm:ss');

    const newAppointmentData = {
      pet_id: pet_id,
      appointment_datetime: formattedDatetime,
      employee_id: employee_id,
      veterinarian_id: veterinarian_id,
      status: status,
    };

    const newAppointment = await Appointment.create(newAppointmentData);
    if (newAppointment) {
      res.status(201).json({
        message: 'Lịch khám được tạo thành công!',
        data: newAppointment
      });
    } else {
      console.error("Appointment creation failed, newAppointment is null.");
      res.status(500).json({ message: 'Không thể tạo lịch khám.' });
    }
  } catch (error) {
    console.error("Lỗi khi tạo lịch khám:", error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tạo lịch khám.', error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.status(200).json({
      message: 'Danh sách lịch khám',
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error("Lỗi khi lấy tất cả lịch khám:", error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy danh sách lịch khám.', error: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);

    if (appointment) {
      res.status(200).json({
        message: `Lịch khám với ID ${appointmentId}`,
        data: appointment
      });
    } else {
      res.status(404).json({ message: `Không tìm thấy lịch khám với ID ${appointmentId}.` });
    }
  } catch (error) {
    console.error(`Lỗi khi lấy lịch khám với ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy lịch khám.', error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updatedData = req.body;

    // Nếu có cập nhật appointment_datetime, cần format lại
    if (updatedData.appointment_datetime) {
      updatedData.appointment_datetime = format(new Date(updatedData.appointment_datetime), 'yyyy-MM-dd HH:mm:ss');
    }

    const success = await Appointment.update(appointmentId, updatedData);

    if (success) {
      // Lấy lại bản ghi đã cập nhật để gửi về client
      const updatedAppointment = await Appointment.findById(appointmentId);
      res.status(200).json({
        message: `Lịch khám với ID ${appointmentId} đã được cập nhật thành công!`,
        data: updatedAppointment
      });
    } else {
      res.status(404).json({ message: `Không tìm thấy lịch khám với ID ${appointmentId} để cập nhật hoặc không có gì thay đổi.` });
    }
  } catch (error) {
    console.error(`Lỗi khi cập nhật lịch khám với ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật lịch khám.', error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const success = await Appointment.delete(appointmentId);

    if (success) {
      res.status(200).json({ message: `Lịch khám với ID ${appointmentId} đã được xóa thành công!` });
    } else {
      res.status(404).json({ message: `Không tìm thấy lịch khám với ID ${appointmentId} để xóa.` });
    }
  } catch (error) {
    console.error(`Lỗi khi xóa lịch khám với ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi xóa lịch khám.', error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status: newStatus } = req.body; // Lấy 'status' từ body và đổi tên thành 'newStatus'

    if (!newStatus) {
      return res.status(400).json({ message: 'Trạng thái mới không được cung cấp.' });
    }

    const success = await Appointment.setStatus(appointmentId, newStatus);

    if (success) {
      // Lấy lại bản ghi đã cập nhật để gửi về client
      const updatedAppointment = await Appointment.findById(appointmentId);
      res.status(200).json({
        message: `Trạng thái lịch khám với ID ${appointmentId} đã được cập nhật thành công!`,
        data: updatedAppointment
      });
    } else {
      res.status(404).json({ message: `Không tìm thấy lịch khám với ID ${appointmentId} để cập nhật trạng thái hoặc trạng thái không thay đổi.` });
    }
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái lịch khám với ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi cập nhật trạng thái lịch khám.', error: error.message });
  }
};
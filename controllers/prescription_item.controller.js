const PrescriptionItem = require('../models/prescription_item.model');

// Tạo chi tiết đơn thuốc mới
exports.create = async (req, res) => {
  try {
    const newItem = new PrescriptionItem(req.body);
    const created = await PrescriptionItem.create(newItem);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo chi tiết đơn thuốc', error });
  }
};

// Lấy tất cả chi tiết đơn thuốc
exports.getAll = async (req, res) => {
  try {
    const items = await PrescriptionItem.getAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách chi tiết đơn thuốc', error });
  }
};

// Lấy chi tiết đơn thuốc theo ID
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await PrescriptionItem.getById(id);
    if (!item) {
      return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn thuốc' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn thuốc', error });
  }
};

// Lấy các chi tiết theo prescription_id
exports.getByPrescriptionId = async (req, res) => {
  try {
    const prescriptionId = req.params.prescriptionId;
    const items = await PrescriptionItem.getByPrescriptionId(prescriptionId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy các chi tiết theo đơn thuốc', error });
  }
};

// Cập nhật chi tiết đơn thuốc
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedItem = await PrescriptionItem.update(id, req.body);
    if (!updatedItem) {
      return res.status(404).json({ message: 'Không tìm thấy để cập nhật' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật chi tiết đơn thuốc', error });
  }
};

// Xóa chi tiết đơn thuốc
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await PrescriptionItem.remove(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Không tìm thấy để xoá' });
    }
    res.json({ message: 'Đã xoá thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xoá chi tiết đơn thuốc', error });
  }
};

const db = require('../config/db');

class MedicineType {
  constructor(data) {
    this.medicine_type_id = data.medicine_type_id;
    this.type_name = data.type_name;
    this.description = data.description;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  
  static async getAll() {
      const [rows] = await db.execute('SELECT medicine_type_id, type_name FROM medicinetypes');
      return rows;
  }

  static async getById(id) {
      const [rows] = await db.execute('SELECT medicine_type_id, type_name FROM medicinetypes WHERE medicine_type_id = ?', [id]);
      return rows[0];
  }

  // Bạn có thể thêm các phương thức create, update, delete nếu cần

}

module.exports = MedicineType;
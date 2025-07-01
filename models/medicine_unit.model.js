const db = require('../config/db');

class MedicineUnit {
  constructor(data) {
    this.medicine_unit_id = data.medicine_unit_id;
    this.unit_name = data.unit_name;
    this.description = data.description;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  
  static async getAll() {
      const [rows] = await db.execute('SELECT medicine_unit_id, unit_name FROM medicineunits');
      return rows;
  }

  static async getById(id) {
      const [rows] = await db.execute('SELECT medicine_unit_id, unit_name FROM medicineunits WHERE medicine_unit_id = ?', [id]);
      return rows[0];
  }

}

module.exports = MedicineUnit;
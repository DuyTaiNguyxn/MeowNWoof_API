const db = require('../config/db');

class MedicineType {
  constructor(data) {
    this.medicine_id = data.medicine_id;
    this.medicine_name = data.medicine_name;
    this.description = data.description || null;
    this.type_id = data.type_id;
    this.unit_id = data.unit_id;
    this.species_use = data.species_use;
    this.stock_quantity = data.stock_quantity;
    this.receipt_date = data.receipt_date;
    this.expiry_date = data.expiry_date;
    this.manufacturer = data.manufacturer;
    this.price = data.price || null;
    this.imageURL = data.imageURL || null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;

    this.type = data.type_id ? {
      medicine_type_id: data.type_id,
      type_name: data.type_name || null,
    } : null;

    this.unit = data.unit_id ? {
      medicine_unit_id: data.unit_id,
      unit_name: data.unit_name || null,
    } : null;
  }

  static async getAll() {
    const [rows] = await db.execute(`
      SELECT 
        m.*, 
        t.type_name, 
        u.unit_name 
      FROM medicines m
      LEFT JOIN medicinetypes t ON m.type_id = t.medicine_type_id
      LEFT JOIN medicineunits u ON m.unit_id = u.medicine_unit_id
    `);

    return rows.map(row => new MedicineType(row));
  }

  static async getById(id) {
    const [rows] = await db.execute(`
      SELECT 
        m.*, 
        t.type_name, 
        u.unit_name 
      FROM medicines m
      LEFT JOIN medicinetypes t ON m.type_id = t.medicine_type_id
      LEFT JOIN medicineunits u ON m.unit_id = u.medicine_unit_id
      WHERE m.medicine_id = ?
    `, [id]);

    return rows.length ? new MedicineType(rows[0]) : null;
  }
}

module.exports = MedicineType;

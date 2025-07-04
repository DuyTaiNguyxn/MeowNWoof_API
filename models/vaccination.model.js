const db = require('../config/db');

class Vaccination {
  constructor(data) {
    this.vaccination_id = data.vaccination_id;
    this.pet_id = data.pet_id;
    this.vaccination_datetime = data.vaccination_datetime;
    this.disease_prevented = data.disease_prevented;
    this.vaccine_id = data.vaccine_id;
    this.employee_id = data.employee_id;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;

    this.pet = data.pet_name
      ? {
          pet_id: data.pet_id,
          pet_name: data.pet_name,
          imageURL: data.pet_imageURL || null,
        }
      : null;

    this.vaccine = data.vaccine_name
      ? {
          medicine_id: data.vaccine_id,
          medicine_name: data.vaccine_name,
          imageURL: data.med_imageURL || null,
        }
      : null;
  }

  static _addJoins(query) {
    return `
      SELECT
        vax.*,
        p.pet_name,
        p.imageURL AS pet_imageURL,
        m.medicine_name AS vaccine_name,
        m.imageURL AS med_imageURL
      FROM vaccinationschedules vax
      LEFT JOIN pets p ON vax.pet_id = p.pet_id
      LEFT JOIN medicines m ON vax.vaccine_id = m.medicine_id
      ${query}
    `;
  }

  static async create(data) {
    const [result] = await db.execute(
      `INSERT INTO vaccinationschedules (
        pet_id, vaccination_datetime, disease_prevented, vaccine_id, employee_id, status
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.pet_id,
        data.vaccination_datetime,
        data.disease_prevented,
        data.vaccine_id,
        data.employee_id,
        data.status,
      ]
    );

    if (result.insertId) {
      const created = await this.findById(result.insertId);
      if (created) return created;
      throw new Error('Đã tạo lịch tiêm chủng nhưng không thể truy xuất chi tiết.');
    }

    throw new Error('Không thể chèn lịch tiêm chủng vào CSDL.');
  }

  static async findAll() {
    const [rows] = await db.query(this._addJoins(''));
    return rows.map(row => new Vaccination(row));
  }

  static async findById(id) {
    const [rows] = await db.query(this._addJoins('WHERE vax.vaccination_id = ?'), [id]);
    return rows.length ? new Vaccination(rows[0]) : null;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    for (const key in data) {
      if (['vaccination_id', 'created_at', 'updated_at', 'pet', 'vaccine', 'employee'].includes(key)) continue;
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    if (fields.length === 0) return false;

    values.push(id);

    const [result] = await db.query(
      `UPDATE vaccinationschedules SET ${fields.join(', ')} WHERE vaccination_id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM vaccinationschedules WHERE vaccination_id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async setStatus(id, newStatus) {
    const [result] = await db.query(
      `UPDATE vaccinationschedules SET status = ? WHERE vaccination_id = ?`,
      [newStatus, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Vaccination;

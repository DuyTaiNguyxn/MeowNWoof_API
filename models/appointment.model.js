const db = require('../config/db');

class Appointment {
  constructor(data) {
    this.appointment_id = data.appointment_id;
    this.pet_id = data.pet_id;
    this.appointment_datetime = data.appointment_datetime;
    this.healthcare_staff_id = data.healthcare_staff_id;
    this.veterinarian_id = data.veterinarian_id;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;

    // Thông tin bác sĩ thú y
    this.veterinarian = data.veterinarian_employee_id
      ? {
          employee_id: data.veterinarian_employee_id,
          full_name: data.veterinarian_full_name || null,
          phone: data.veterinarian_phone || null,
          email: data.veterinarian_email || null,
          role: data.veterinarian_role || null,
          avatarURL: data.veterinarian_avatarURL || null,
        }
      : null;

    // Thông tin pet (thêm các trường từ bảng pets)
    this.pet = data.pet_name
      ? {
          pet_id: data.pet_id,
          pet_name: data.pet_name,
          species_id: data.species_id,
          breed_id: data.breed_id,
          age: data.age || null,
          gender: data.gender || null,
          weight: data.weight || null,
          imageURL: data.imageURL || null,
          species_name: data.species_name || null,
          breed_name: data.breed_name || null,
        }
      : null;
  }

  static _addJoins(query) {
    return `
      SELECT
        a.*,
        v.employee_id AS veterinarian_employee_id,
        v.full_name AS veterinarian_full_name,
        v.email AS veterinarian_email,
        v.phone AS veterinarian_phone,
        v.role AS veterinarian_role,
        v.avatarURL AS veterinarian_avatarURL,
        p.pet_name,
        p.species_id,
        p.breed_id,
        p.age,
        p.gender,
        p.weight,
        p.imageURL,
        S.species_name,
        B.breed_name
      FROM appointments a
      LEFT JOIN employees v ON a.veterinarian_id = v.employee_id
      LEFT JOIN pets p ON a.pet_id = p.pet_id
      LEFT JOIN species S ON p.species_id = S.species_id
      LEFT JOIN breeds B ON p.breed_id = B.BreeD_id
      ${query}
    `;
  }

  static async create(data) {
    const [result] = await db.execute(
      `INSERT INTO appointments (
        pet_id, appointment_datetime, healthcare_staff_id, veterinarian_id, status
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        data.pet_id,
        data.appointment_datetime,
        data.healthcare_staff_id,
        data.veterinarian_id,
        data.status,
      ]
    );

    if (result.insertId) {
      const created = await this.findById(result.insertId);
      if (created) return created;
      throw new Error('Đã tạo lịch khám nhưng không thể truy xuất chi tiết.');
    }

    throw new Error('Không thể chèn lịch khám vào CSDL.');
  }

  static async findAll() {
    const [rows] = await db.query(this._addJoins(''));
    return rows.map(row => new Appointment(row));
  }

  static async findById(id) {
    const [rows] = await db.query(this._addJoins('WHERE a.appointment_id = ?'), [id]);
    return rows.length ? new Appointment(rows[0]) : null;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    for (const key in data) {
      if (['appointment_id', 'created_at', 'veterinarian', 'pet'].includes(key)) continue;
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    if (fields.length === 0) return false;

    values.push(id);

    const [result] = await db.query(
      `UPDATE appointments SET ${fields.join(', ')} WHERE appointment_id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM appointments WHERE appointment_id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async setStatus(id, newStatus) {
    const [result] = await db.query(
      `UPDATE appointments SET status = ? WHERE appointment_id = ?`,
      [newStatus, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Appointment;
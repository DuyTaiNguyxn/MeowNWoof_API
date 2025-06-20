const db = require('../config/db');

class MedicalRecord {
  constructor(data) {
    this.medical_record_id = data.medical_record_id;
    this.pet_id = data.pet_id;
    this.record_date = data.record_date;
    this.symptoms = data.symptoms || null;
    this.preliminary_diagnosis = data.preliminary_diagnosis || null;
    this.final_diagnosis = data.final_diagnosis;
    this.treatment_method = data.treatment_method;
    this.veterinarian_id = data.veterinarian_id;
    this.veterinarian_note = data.veterinarian_note || null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;

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
  }

  static _addVeterinarianJoin(query) {
    return `
      SELECT
        mr.*,
        e.employee_id AS veterinarian_employee_id,
        e.full_name AS veterinarian_full_name,
        e.email AS veterinarian_email,
        e.phone AS veterinarian_phone,
        e.role AS veterinarian_role,
        e.avatarURL AS veterinarian_avatarURL
      FROM PetMedicalRecords mr
      LEFT JOIN employees e ON mr.veterinarian_id = e.employee_id
      ${query}
    `;
  }

  static async create(data) {
    const [result] = await db.execute(
      `INSERT INTO PetMedicalRecords (
        pet_id, record_date, symptoms, preliminary_diagnosis,
        final_diagnosis, treatment_method, veterinarian_id, veterinarian_note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.pet_id,
        data.record_date,
        data.symptoms || null,
        data.preliminary_diagnosis || null,
        data.final_diagnosis,
        data.treatment_method,
        data.veterinarian_id,
        data.veterinarian_note || null,
      ]
    );

    if (result.insertId) {
      const created = await this.findById(result.insertId);
      if (created) return created;
      throw new Error('Đã tạo hồ sơ nhưng không thể truy xuất chi tiết.');
    }

    throw new Error('Không thể chèn hồ sơ bệnh án vào CSDL.');
  }

  static async findAll() {
    const [rows] = await db.query(this._addVeterinarianJoin(''));
    return rows.map(row => new MedicalRecord(row));
  }

  static async findById(id) {
    const [rows] = await db.query(this._addVeterinarianJoin('WHERE mr.medical_record_id = ?'), [id]);
    return rows.length ? new MedicalRecord(rows[0]) : null;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    for (const key in data) {
      if (['medical_record_id', 'created_at', 'veterinarian'].includes(key)) continue;
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    if (fields.length === 0) return false;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const [result] = await db.query(
      `UPDATE PetMedicalRecords SET ${fields.join(', ')} WHERE medical_record_id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM PetMedicalRecords WHERE medical_record_id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findByPetId(petId) {
    const [rows] = await db.query(
      this._addVeterinarianJoin('WHERE mr.pet_id = ? ORDER BY mr.record_date DESC'),
      [petId]
    );
    return rows.map(row => new MedicalRecord(row));
  }

  static async findByVeterinarianId(vetId) {
    const [rows] = await db.query(
      this._addVeterinarianJoin('WHERE mr.veterinarian_id = ? ORDER BY mr.record_date DESC'),
      [vetId]
    );
    return rows.map(row => new MedicalRecord(row));
  }
}

module.exports = MedicalRecord;
// models/medical_record.model.js
const db = require('../config/db');

class MedicalRecord {
    constructor(data) {
        this.medical_record_id = data.medical_record_id;
        this.pet_id = data.pet_id;
        this.record_date = data.record_date;
        this.symptoms = data.symptoms;
        this.preliminary_diagnosis = data.preliminary_diagnosis;
        this.final_diagnosis = data.final_diagnosis;
        this.treatment_method = data.treatment_method;
        this.veterinarian_id = data.veterinarian_id;
        this.veterinarian_note = data.veterinarian_note;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;

        if (data.veterinarian_employee_id) {
            this.veterinarian = {
                employee_id: data.veterinarian_employee_id,
                full_name: data.veterinarian_full_name,
                phone: data.veterinarian_phone,
                email: data.veterinarian_email,
                role: data.veterinarian_role,
                avatarURL: data.veterinarian_avatarURL,
            };
        } else {
            this.veterinarian = null;
        }
    }

    static _addVeterinarianJoin(query) {
        return `
            SELECT
                mr.*,
                u.employee_id AS veterinarian_employee_id,
                u.full_name AS veterinarian_full_name,
                u.email AS veterinarian_email,
                u.phone AS veterinarian_phone,
                u.role AS veterinarian_role,
                u.avatarURL AS veterinarian_avatarURL
            FROM PetMedicalRecords mr
            LEFT JOIN employees u ON mr.veterinarian_id = u.employee_id
            ${query}
        `;
    }

    // --- Các phương thức CRUD (giữ nguyên không đổi) ---
    static async create(newMedicalRecordData) {
        try {
            const result = await db.query(
                `INSERT INTO PetMedicalRecords (pet_id, record_date, symptoms, preliminary_diagnosis, final_diagnosis, treatment_method, veterinarian_id, veterinarian_note)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newMedicalRecordData.pet_id,
                    newMedicalRecordData.record_date,
                    newMedicalRecordData.symptoms,
                    newMedicalRecordData.preliminary_diagnosis,
                    newMedicalRecordData.final_diagnosis,
                    newMedicalRecordData.treatment_method,
                    newMedicalRecordData.veterinarian_id,
                    newMedicalRecordData.veterinarian_note
                ]
            );
            if (result.insertId) {
                const createdRecord = await this.findById(result.insertId);
                return createdRecord;
            }
            return null;
        } catch (error) {
            console.error("Error creating medical record:", error);
            throw error;
        }
    }

    static async findAll() {
        try {
            const query = this._addVeterinarianJoin('');
            const [rows] = await db.query(query);
            return rows.map(row => new MedicalRecord(row));
        } catch (error) {
            console.error("Error finding all medical records:", error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const query = this._addVeterinarianJoin('WHERE mr.medical_record_id = ?');
            const [rows] = await db.query(query, [id]);
            if (rows.length > 0) {
                return new MedicalRecord(rows[0]);
            }
            return null;
        } catch (error) {
            console.error(`Error finding medical record with ID ${id}:`, error);
            throw error;
        }
    }

    static async update(id, updatedData) {
        try {
            const fields = [];
            const values = [];
            for (const key in updatedData) {
                if (updatedData.hasOwnProperty(key) && key !== 'medical_record_id' && key !== 'created_at' && key !== 'veterinarian') {
                    fields.push(`${key} = ?`);
                    values.push(updatedData[key]);
                }
            }
            values.push(id);

            if (fields.length === 0) {
                return false;
            }

            const query = `UPDATE PetMedicalRecords SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE medical_record_id = ?`;
            const [result] = await db.query(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error updating medical record with ID ${id}:`, error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM PetMedicalRecords WHERE medical_record_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting medical record with ID ${id}:`, error);
            throw error;
        }
    }

    // --- Các phương thức hỗ trợ/tìm kiếm khác (giữ nguyên không đổi) ---
    static async findByPetId(petId) {
        try {
            const query = this._addVeterinarianJoin('WHERE mr.pet_id = ? ORDER BY mr.record_date DESC');
            const [rows] = await db.query(query, [petId]);
            return rows.map(row => new MedicalRecord(row));
        } catch (error) {
            console.error(`Error finding medical records for pet ID ${petId}:`, error);
            throw error;
        }
    }

    static async findByVeterinarianId(veterinarianId) {
        try {
            const query = this._addVeterinarianJoin('WHERE mr.veterinarian_id = ? ORDER BY mr.record_date DESC');
            const [rows] = await db.query(query, [veterinarianId]);
            return rows.map(row => new MedicalRecord(row));
        } catch (error) {
            console.error(`Error finding medical records by veterinarian ID ${veterinarianId}:`, error);
            throw error;
        }
    }
}

module.exports = MedicalRecord;
const pool = require('../config/db');

class Prescription {
    constructor(prescription) {
        this.medical_record_id = prescription.medical_record_id;
        this.veterinarian_id = prescription.veterinarian_id;
        this.veterinarian_note = prescription.veterinarian_note;
        this.prescription_date = prescription.prescription_date;
    }

    static async create(newPrescription) {
        try {
            const [result] = await pool.execute(
                'INSERT INTO prescriptions (medical_record_id, veterinarian_id, veterinarian_note, prescription_date) VALUES (?, ?, ?, ?)',
                [newPrescription.medical_record_id, newPrescription.veterinarian_id, newPrescription.veterinarian_note, newPrescription.prescription_date]
            );
            return { id: result.insertId, ...newPrescription };
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const [rows] = await pool.execute('SELECT * FROM prescriptions');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByRecordId(id) {
        try {
            // Lấy thông tin đơn thuốc chính
            const [prescriptionRows] = await pool.execute(
                'SELECT * FROM prescriptions WHERE medical_record_id = ?',
                [id]
            );
            const prescription = prescriptionRows[0];
            if (!prescription) return null;

            // Lấy các thuốc trong đơn
            const [itemRows] = await pool.execute(
                `SELECT pd.*, m.medicine_name, m.imageURL
                 FROM prescriptionitems pd
                 JOIN medicines m ON pd.medicine_id = m.medicine_id
                 WHERE pd.prescription_id = ?`,
                [id]
            );

            // Nhúng items vào prescription
            prescription.items = itemRows;

            return prescription;
        } catch (error) {
            throw error;
        }
    }

    static async updateById(id, prescription) {
        try {
            const [result] = await pool.execute(
                'UPDATE prescriptions SET veterinarian_note = ?, prescription_date = ? WHERE prescription_id = ?',
                [prescription.veterinarian_note, prescription.prescription_date, id]
            );
            if (result.affectedRows === 0) {
                return null;
            }
            return { id: id, ...prescription };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Prescription;

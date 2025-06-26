const pool = require('../config/db');

class Prescription {
    constructor(prescription) {
        this.prescription_id = prescription.prescription_id;
        this.medical_record_id = prescription.medical_record_id;
        this.veterinarian_id = prescription.veterinarian_id;
        this.veterinarian_note = prescription.veterinarian_note;
        this.prescription_date = prescription.prescription_date;
    }

    static async create(newPrescription) {
        try {
            const [result] = await pool.execute(
                'INSERT INTO prescriptions (medical_record_id, veterinarian_id, veterinarian_note, prescription_date) VALUES (?, ?, ?, ?)',
                [
                    newPrescription.medical_record_id,
                    newPrescription.veterinarian_id,
                    newPrescription.veterinarian_note,
                    newPrescription.prescription_date
                ]
            );
            return {
                prescription_id: result.insertId,
                ...newPrescription
            };
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
                [prescription.prescription_id]
            );

            prescription.items = itemRows;
            return prescription;
        } catch (error) {
            throw error;
        }
    }

    static async updateById(id, fieldsToUpdate) {
        try {
            const updateFields = [];
            const updateValues = [];

            for (const key in fieldsToUpdate) {
                if (fieldsToUpdate.hasOwnProperty(key)) {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(fieldsToUpdate[key]);
                }
            }

            if (updateFields.length === 0) {
                return null;
            }

            const updateQuery = `UPDATE prescriptions SET ${updateFields.join(', ')} WHERE prescription_id = ?`;
            updateValues.push(id);

            const [updateResult] = await pool.execute(updateQuery, updateValues);

            if (updateResult.affectedRows === 0) {
                return null;
            }

            const [rows] = await pool.execute('SELECT * FROM prescriptions WHERE prescription_id = ?', [id]);

            if (rows.length === 0) {
                return null;
            }

            return rows[0];

        } catch (error) {
            throw error;
        }
    }

    static async deleteItemsByPrescriptionId(prescriptionId) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM prescriptionitems WHERE prescription_id = ?',
                [prescriptionId]
            );
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    static async deletePrescription(prescriptionId) {
        try {
            await pool.execute(
                'DELETE FROM prescriptions WHERE prescription_id = ?',
                [prescriptionId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = Prescription;

const pool = require('../config/db');

class PrescriptionItem {
    constructor(item) {
        this.item_id = item.item_id;
        this.prescription_id = item.prescription_id;
        this.medicine_id = item.medicine_id;
        this.quantity = item.quantity;
        this.dosage = item.dosage;
        this.medicine_name = item.medicine_name;
        this.imageURL = item.imageURL;
    }

    static async create(newItem) {
        try {
            const [result] = await pool.execute(
                'INSERT INTO prescriptionitems (prescription_id, medicine_id, quantity, dosage) VALUES (?, ?, ?, ?)',
                [newItem.prescription_id, newItem.medicine_id, newItem.quantity, newItem.dosage]
            );
            return { id: result.insertId, ...newItem };
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const [rows] = await pool.execute(`
                SELECT pi.*, m.medicine_name, m.imageURL
                FROM prescriptionitems pi
                JOIN medicines m ON pi.medicine_id = m.medicine_id
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.execute(`
                SELECT pi.*, m.medicine_name, m.imageURL
                FROM prescriptionitems pi
                JOIN medicines m ON pi.medicine_id = m.medicine_id
                WHERE pi.item_id = ?
            `, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByPrescriptionId(prescriptionId) {
        try {
            const [rows] = await pool.execute(`
                SELECT pi.*, m.medicine_name, m.image_url
                FROM prescriptionitems pi
                JOIN medicines m ON pi.medicine_id = m.medicine_id
                WHERE pi.prescription_id = ?
            `, [prescriptionId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, item) {
        try {
            const [result] = await pool.execute(
                'UPDATE prescriptionitems SET prescription_id = ?, medicine_id = ?, quantity = ?, dosage = ? WHERE item_id = ?',
                [item.prescription_id, item.medicine_id, item.quantity, item.dosage, id]
            );
            if (result.affectedRows === 0) {
                return null;
            }
            return { id: id, ...item };
        } catch (error) {
            throw error;
        }
    }

    static async remove(id) {
        try {
            const [result] = await pool.execute('DELETE FROM prescriptionitems WHERE item_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PrescriptionItem;

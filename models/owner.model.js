const db = require('../config/db');

class PetOwner {
  constructor(data) {
    this.owner_id = data.owner_id;
    this.owner_name = data.owner_name;
    this.phone = data.phone;
    this.email = data.email;
    this.address = data.address;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  
  static async create(ownerData) {
      const { owner_name, phone, email, address } = ownerData;
      const [result] = await db.execute(
          'INSERT INTO PetOwners (owner_name, phone, email, address) VALUES (?, ?, ?, ?)',
          [owner_name, phone, email, address]
      );
      return { owner_id: result.insertId, ...ownerData };
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM PetOwners');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM PetOwners WHERE owner_id = ?', [id]);
    return rows[0];
  }

  static async findByPhone(phone) {
      const [rows] = await db.execute('SELECT * FROM PetOwners WHERE phone = ?', [phone]);
      return rows.length > 0 ? new PetOwner(rows[0]) : null;
  }
}

module.exports = PetOwner;
// models/user.model.js
const db = require('../config/db'); // pool connection
const bcrypt = require('bcrypt');

class User {
  constructor(data) {
    this.employee_id = data.employee_id;
    this.full_name = data.full_name;
    this.email = data.email;
    this.phone = data.phone;
    this.birth = data.birth;
    this.address = data.address;
    this.role = data.role;
    this.avatarURL = data.avatarURL;
    this.username = data.username;
    this.password = data.password;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Find all employees
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM Employees');
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM Employees WHERE employee_id = ?';
    const [rows] = await db.execute(query, [id]);
    if (rows.length > 0) {
        const userData = rows[0];
        return {
            employee_id: userData.employee_id,
            username: userData.username,
            full_name: userData.full_name,
            email: userData.email,
            phone: userData.phone,
            birth: userData.birth,
            address: userData.address,
            avatarURL: userData.avatarURL,
            role: userData.role,
        };
    }
    return null;
}

  static async findByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM Employees WHERE username = ?', [username]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM Employees WHERE email = ?', [email]);
    return rows[0];
  }

  static async findByPhone(phone) {
    const [rows] = await db.execute('SELECT * FROM Employees WHERE phone = ?', [phone]);
    return rows[0];
  }

  static async create(employeeData) {
    const hashedPassword = await bcrypt.hash(employeeData.password, 10);
    const [result] = await db.execute(
      `INSERT INTO Employees (full_name, email, phone, birth, address, role, avatarURL, username, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeData.full_name,
        employeeData.email,
        employeeData.phone,
        employeeData.birth,
        employeeData.address,
        employeeData.role,
        employeeData.avatarURL,
        employeeData.username,
        hashedPassword
      ]
    );
    return result.insertId;
  }

  static async update(id, updateFields) {
    console.log(`[UserModel] Cập nhật User ID: ${id}`);
    console.log('[UserModel] updateFields:', updateFields);

    const fields = [];
    const values = [];

    const allowedFields = [
        'full_name',
        'email',
        'phone',
        'birth',
        'address',
        'avatarURL'
    ];

    for (const key in updateFields) {
        if (updateFields[key] !== undefined && allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(updateFields[key]);
        }
    }

    if (fields.length === 0) {
        return await this.findById(id);
    }

    values.push(id);

    const query = `UPDATE Employees SET ${fields.join(', ')} WHERE employee_id = ?`;
    console.log('[UserModel] SQL Query:', query);
    console.log('[UserModel] SQL Values:', values);

    try {
        const [result] = await db.execute(query, values);

        if (result.affectedRows > 0) {
            const updatedEmployee = await this.findById(id);
            console.log(`id from fingbyid: ${updatedEmployee.employee_id}`);
            console.log(`name from fingbyid: ${updatedEmployee.full_name}`);
            console.log(`birth from fingbyid: ${updatedEmployee.birth}`);
            return updatedEmployee;
        }
        return null;
    } catch (error) {
        console.error(`Lỗi khi cập nhật nhân viên với ID ${id}:`, error);
        throw error;
    }
  }

  // Delete an employee by ID
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM Employees WHERE employee_id = ?', [id]);
    return result; // Contains affectedRows
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
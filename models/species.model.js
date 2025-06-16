const db = require('../config/db');

class Species {
  constructor(data) {
    this.species_id = data.species_id;
    this.species_name = data.species_name;
    this.description = data.description;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  
  static async getAll() {
      const [rows] = await db.execute('SELECT species_id, species_name FROM species');
      return rows;
  }

  static async getById(speciesId) {
      const [rows] = await db.execute('SELECT species_id, species_name FROM species WHERE species_id = ?', [speciesId]);
      return rows[0]; // Trả về đối tượng đầu tiên nếu tìm thấy
  }

  // Bạn có thể thêm các phương thức create, update, delete nếu cần

}

module.exports = Species;
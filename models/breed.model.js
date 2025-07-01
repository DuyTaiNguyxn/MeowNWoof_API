const db = require('../config/db');

class Breed {
  constructor(data) {
    this.breed_id = data.breed_id;
    this.breed_name = data.breed_name;
    this.description = data.description;
    this.species_id = data.species_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  
  static async getAll() {
      const [rows] = await db.execute('SELECT breed_id, breed_name, species_id FROM breeds');
      return rows;
  }

  static async getById(breedId) {
      const [rows] = await db.execute('SELECT breed_id, breed_name, species_id FROM breeds WHERE breed_id = ?', [breedId]);
      return rows[0];
  }

  static async findBySpeciesId(speciesId) {
        const query = `
            SELECT breed_id, breed_name, species_id, description -- Đảm bảo species_id cũng được chọn
            FROM Breeds
            WHERE species_id = ?; -- ĐÂY LÀ PHẦN LỌC QUAN TRỌNG!
        `;
        const [rows] = await db.execute(query, [speciesId]);
        return rows.map(row => ({
            breed_id: row.breed_id,
            breed_name: row.breed_name,
            species_id: row.species_id,
            description: row.description || null
        }));
    }

}

module.exports = Breed;
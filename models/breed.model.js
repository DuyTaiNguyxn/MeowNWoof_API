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
        // Chú ý: speciesId từ req.params là một chuỗi, bạn có thể cần chuyển nó thành số nếu database yêu cầu
        // Ví dụ: db.execute(query, [parseInt(speciesId)]);
        const [rows] = await db.execute(query, [speciesId]);
        // Để đảm bảo Flutter có đủ thông tin, hãy bao gồm species_id trong đối tượng trả về của mỗi giống
        return rows.map(row => ({
            breed_id: row.breed_id,
            breed_name: row.breed_name,
            species_id: row.species_id, // Quan trọng: Bao gồm species_id trong JSON phản hồi
            description: row.description || null
        }));
    }

  // Bạn có thể thêm các phương thức create, update, delete nếu cần

}

module.exports = Breed;
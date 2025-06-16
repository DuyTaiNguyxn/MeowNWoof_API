// models/pet.model.js
const db = require('../config/db');

class Pet {
    constructor(data) {
        this.pet_id = data.pet_id;
        this.pet_name = data.pet_name;
        this.species_id = data.species_id;
        this.breed_id = data.breed_id;
        this.age = data.age;
        this.gender = data.gender;
        this.weight = data.weight;
        this.imageURL = data.imageURL;
        this.owner_id = data.owner_id;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.owner = data.owner || null;
        this.species = data.species || null;
        this.breed = data.breed || null;
    }

    static _formatPet(row) {
        if (!row) return null;

        const petData = {
            pet_id: row.pet_id,
            pet_name: row.pet_name,
            species_id: row.species_id,
            breed_id: row.breed_id,
            age: row.age,
            gender: row.gender,
            weight: row.weight,
            imageURL: row.imageURL,
            owner_id: row.owner_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
        };

        if (row.owner_id_owner_table) {
            petData.owner = {
                owner_id: row.owner_id_owner_table,
                owner_name: row.owner_name,
                phone: row.phone,
                email: row.email,
                address: row.address,
            };
        }

        if (row.species_id_species_table) {
            petData.species = {
                species_id: row.species_id_species_table,
                species_name: row.species_name,
                description: row.species_description,
            };
        }

        if (row.breed_id_breed_table) {
            petData.breed = {
                breed_id: row.breed_id_breed_table,
                breed_name: row.breed_name,
                description: row.breed_description,
                species_id: row.species_id,
            };
        }

        return new Pet(petData);
    }

    static async findAll() {
        const query = `
            SELECT
                p.pet_id, p.pet_name, p.age, p.gender, p.weight, p.imageURL, p.created_at, p.updated_at,
                p.species_id, s.species_id AS species_id_species_table, s.species_name, s.description AS species_description,
                p.breed_id, b.breed_id AS breed_id_breed_table, b.breed_name, b.description AS breed_description,
                p.owner_id, o.owner_id AS owner_id_owner_table, o.owner_name, o.phone, o.email, o.address
            FROM
                Pets p
            LEFT JOIN
                Species s ON p.species_id = s.species_id
            LEFT JOIN
                Breeds b ON p.breed_id = b.breed_id
            LEFT JOIN
                PetOwners o ON p.owner_id = o.owner_id;
        `;

        const [rows] = await db.execute(query);
        return rows.map(row => Pet._formatPet(row));
    }

    static async findById(id) {
        const query = `
            SELECT
                p.pet_id, p.pet_name, p.age, p.gender, p.weight, p.imageURL, p.created_at, p.updated_at,
                p.species_id, s.species_id AS species_id_species_table, s.species_name, s.description AS species_description,
                p.breed_id, b.breed_id AS breed_id_breed_table, b.breed_name, b.description AS breed_description,
                p.owner_id, o.owner_id AS owner_id_owner_table, o.owner_name, o.phone, o.email, o.address
            FROM
                Pets p
            LEFT JOIN
                Species s ON p.species_id = s.species_id
            LEFT JOIN
                Breeds b ON p.breed_id = b.breed_id
            LEFT JOIN
                PetOwners o ON p.owner_id = o.owner_id
            WHERE
                p.pet_id = ?;
        `;

        const [rows] = await db.execute(query, [id]);
        return Pet._formatPet(rows[0]);
    }

    static async create(petData) {
        const { pet_name, species_id, breed_id, age, gender, weight, imageURL, owner_id } = petData;
        const [result] = await db.execute(
            'INSERT INTO Pets (pet_name, species_id, breed_id, age, gender, weight, imageURL, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [pet_name, species_id, breed_id, age, gender, weight, imageURL, owner_id]
        );
        return { pet_id: result.insertId, ...petData };
    }

    static async update(id, petData) {
        const fields = [];
        const values = [];

        const allowedFields = [
            'pet_name',
            'species_id',
            'breed_id',
            'age',
            'gender',
            'weight',
            'imageURL'
        ];

        for (const key in petData) {
            if (petData[key] !== undefined && allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                values.push(petData[key]);
            }
        }

        if (fields.length === 0) {
            return null;
        }

        values.push(id);

        const query = `UPDATE Pets SET ${fields.join(', ')} WHERE pet_id = ?`;
        
        try {
            const [result] = await db.execute(query, values);

            if (result.affectedRows > 0) {
                const updatedPet = await this.findById(id);
                return updatedPet;
            }
            return null; 
        } catch (error) {
            console.error(`Lỗi khi cập nhật pet với ID ${id}:`, error);
            throw error;
        }
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM Pets WHERE pet_id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Pet;
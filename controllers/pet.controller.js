// controllers/pet.controller.js

const Pet = require('../models/pet.model'); // Import Pet model
const PetOwner = require('../models/owner.model'); // Import PetOwner model mới tạo

// Lấy tất cả pets
exports.getAllPets = async (req, res) => {
    try {
        const pets = await Pet.findAll(); // Gọi phương thức từ Pet model
        res.json(pets);
    } catch (err) {
        console.error('Error fetching all pets:', err);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách pets.', error: err.message });
    }
};

// Lấy pet theo ID
exports.getPetById = async (req, res) => {
    const { id } = req.params;
    try {
        const pet = await Pet.findById(id);
        if (!pet) {
            return res.status(404).json({ message: 'Không tìm thấy pet.' });
        }
        res.json(pet);
    } catch (err) {
        console.error(`Error fetching pet with ID ${id}:`, err);
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin pet.', error: err.message });
    }
};

// Tạo pet mới
exports.createPet = async (req, res) => {
    // Nhận toàn bộ dữ liệu từ body, bao gồm đối tượng owner
    const petData = req.body; 

    try {
        // Gọi hàm create của Pet, nó sẽ tự xử lý việc tạo/tìm owner
        const createdPet = await Pet.create(petData);

        res.status(201).json(createdPet); // Trả về đối tượng pet đã tạo với ID
    } catch (err) {
        console.error('Error creating pet:', err);
        // Trả về lỗi chi tiết hơn nếu có
        res.status(err.message.includes('bắt buộc') ? 400 : 500).json({ message: err.message || 'Lỗi server khi tạo pet.' });
    }
};

// Cập nhật pet
exports.updatePet = async (req, res) => {
    const { id } = req.params;
    const petData = req.body; // Dữ liệu cập nhật từ client

    console.log('Controller received pet data:', req.body); // Log dữ liệu nhận được

    try {
        // Gọi phương thức update của model, nó sẽ trả về đối tượng pet đã cập nhật
        const updatedPet = await Pet.update(id, petData);

        if (updatedPet) {
            res.status(200).json(updatedPet);
        } else {
            res.status(404).json({ message: 'Không tìm thấy pet để cập nhật hoặc không có gì thay đổi.' });
        }
    } catch (err) {
        console.error(`Error updating pet with ID ${id}:`, err);
        res.status(500).json({ message: 'Lỗi server khi cập nhật pet.', error: err.message });
    }
};

// Xóa pet
exports.deletePet = async (req, res) => {
    const { id } = req.params;

    try {
        const success = await Pet.delete(id);
        if (success) {
            res.status(200).json({ message: 'Xóa pet thành công.' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy pet để xóa.' });
        }
    } catch (err) {
        console.error(`Error deleting pet with ID ${id}:`, err);
        res.status(500).json({ message: 'Lỗi server khi xóa pet.', error: err.message });
    }
};
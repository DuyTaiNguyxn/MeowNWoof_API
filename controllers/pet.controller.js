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
    const { pet_name, species_id, breed_id, age, gender, weight, imageURL, owner } = req.body;

    // Log dữ liệu nhận được từ request để kiểm tra
    console.log('Controller received pet data:', req.body);
    console.log('Controller received owner data:', owner); // owner là đối tượng được gửi từ Flutter

    try {
        let final_owner_id = null; // Khởi tạo owner_id cuối cùng

        if (owner && owner.phone) { // Đảm bảo thông tin owner và SĐT được gửi đến
            // Kiểm tra xem chủ sở hữu đã tồn tại dựa trên số điện thoại chưa
            let existingOwner = await PetOwner.findByPhone(owner.phone);

            if (existingOwner) {
                final_owner_id = existingOwner.owner_id; // Sử dụng ID của chủ sở hữu đã tồn tại
                console.log('Chủ sở hữu đã tồn tại, sử dụng ID:', final_owner_id);
            } else {
                // Nếu chưa tồn tại, tạo chủ sở hữu mới
                // console.log('Creating new owner with data:', {
                //     owner_name: owner.owner_name,
                //     phone: owner.phone,
                //     email: owner.email,
                //     address: owner.address
                // });
                const newOwner = await PetOwner.create({
                    owner_name: owner.owner_name,
                    phone: owner.phone,
                    email: owner.email,
                    address: owner.address
                });
                final_owner_id = newOwner.owner_id; // Lấy ID của chủ sở hữu vừa tạo
                console.log('Đã tạo chủ sở hữu mới với ID:', final_owner_id);
            }
        } else {
            // Nếu không có thông tin owner hợp lệ hoặc thiếu số điện thoại
            return res.status(400).json({ message: 'Thông tin chủ sở hữu (tên và số điện thoại) là bắt buộc.' });
        }

        // 2. Chuẩn bị dữ liệu cho Pet
        const newPetData = {
            pet_name,
            species_id,
            breed_id,
            age,
            gender,
            weight,
            imageURL, // Vẫn là imageURL theo req.body nhận được từ Flutter
            owner_id: final_owner_id // Gán owner_id đã xác định
        };

        // 3. Tạo Pet mới trong DB
        const createdPet = await Pet.create(newPetData);

        res.status(201).json(createdPet); // Trả về đối tượng pet đã tạo với ID
    } catch (err) {
        console.error('Error creating pet:', err);
        res.status(500).json({ message: 'Lỗi server khi tạo pet.', error: err.message });
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
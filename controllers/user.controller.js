// controllers/user.controller.js

const User = require('../models/user.model'); // Import your User model

// Helper function to exclude sensitive data (like password)
const excludePassword = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

// 1. Lấy tất cả user: Bất kỳ user nào đã đăng nhập cũng có thể xem danh sách
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Call model's findAll method
    // Đảm bảo không trả về mật khẩu
    res.json(users.map(user => excludePassword(user)));
  } catch (err) {
    console.error('Error fetching all users:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách user.' });
  }
};

// 2. Lấy thông tin user theo ID: User có thể xem của chính mình, Admin có thể xem bất kỳ ai
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const requestedId = parseInt(id, 10); // Đảm bảo ID là số nguyên

  try {
    // Kiểm tra quyền:
    // Nếu người dùng không phải admin VÀ ID được yêu cầu không phải là ID của chính người dùng đó
    if (req.role !== 'admin' && req.employee_id !== requestedId) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập thông tin của user này.' });
    }

    const user = await User.findById(requestedId); // Gọi model
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    // Đảm bảo không trả về mật khẩu
    res.json(excludePassword(user));
  } catch (err) {
    console.error(`Error fetching user with ID ${id}:`, err);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin user.' });
  }
};

// 3. Tạo user mới: Chỉ Admin mới được thêm
exports.createUser = async (req, res) => {
  // Vì route đã được bảo vệ bởi authMiddleware.isAdmin,
  // chúng ta biết rằng người gọi hàm này đã là admin.
  const { full_name, email, phone, birth, address, role, avatarURL, username, password } = req.body;

  // Validate required fields
  if (!full_name || !phone || !birth || !role || !username || !password) {
    return res.status(400).json({ message: 'Thiếu các trường bắt buộc: full_name, phone, birth, role, username, password.' });
  }

  try {
    // Kiểm tra trùng lặp (username, email, phone)
    const existingUserByUsername = await User.findByUsername(username);
    if (existingUserByUsername) {
      return res.status(409).json({ message: 'Username đã tồn tại.' });
    }

    if (email) {
      const existingUserByEmail = await User.findByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: 'Email đã tồn tại.' });
      }
    }

    const existingUserByPhone = await User.findByPhone(phone);
    if (existingUserByPhone) {
      return res.status(409).json({ message: 'Số điện thoại đã tồn tại.' });
    }

    const newEmployeeData = {
      full_name, email, phone, birth, address, role, avatarURL, username, password
    };

    const employee_id = await User.create(newEmployeeData); // Gọi model

    res.status(201).json({ message: 'Tạo user thành công', employee_id });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo user.' });
  }
};

// 4. Cập nhật user: User có thể cập nhật của chính mình, Admin có thể cập nhật bất kỳ ai
exports.updateUser = async (req, res) => {
    const requestedId = parseInt(req.params.id);
    const { email, phone, birth, ...updateFields } = req.body; // Lấy các trường muốn update

    console.log(`[UserController] Cập nhật User ID: ${requestedId}`);
    console.log('[UserController] Dữ liệu nhận được từ body:', req.body);

    const userIdFromToken = req.user.employee_id;
    const userRoleFromToken = req.user.role;

    console.log('[UserController] User Role từ token:', userRoleFromToken);
    console.log('[UserController] User ID từ token:', userIdFromToken);

    // Kiểm tra quyền (chỉ admin hoặc chủ sở hữu mới được update)
    if (userRoleFromToken !== 'admin' && userIdFromToken !== requestedId) {
        return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa thông tin người dùng này.' });
    }

    try {
        const existingUser = await User.findById(requestedId);
        if (!existingUser) {
            return res.status(404).json({ message: 'Không tìm thấy user để cập nhật.' });
        }
        console.log('[UserController] Email existingUser từ DB:', existingUser.email);
        console.log('[UserController] Email từ request body:', email);

        // Kiểm tra email trùng lặp (nếu email thay đổi và trùng với email khác)
        if (email && email !== existingUser.email) {
            const userWithNewEmail = await User.findByEmail(email);
            if (userWithNewEmail && userWithNewEmail.employee_id !== requestedId) {
                return res.status(409).json({ message: 'Email đã tồn tại cho user khác.' });
            }
        }
        // Kiểm tra phone trùng lặp (tương tự email)
        if (phone && phone !== existingUser.phone) {
            const userWithNewPhone = await User.findByPhone(phone);
            if (userWithNewPhone && userWithNewPhone.employee_id !== requestedId) {
                return res.status(409).json({ message: 'Số điện thoại đã tồn tại cho user khác.' });
            }
        }

        const fieldsToUpdate = { ...updateFields }; // Sao chép các trường đã được body-parser phân tích

        if (email) fieldsToUpdate.email = email;
        if (phone) fieldsToUpdate.phone = phone;
        if (birth) {
            fieldsToUpdate.birth = new Date(birth);
        }

        const updatedUser = await User.update(requestedId, fieldsToUpdate);

        if (!updatedUser) {
            return res.status(404).json({ message: 'Cập nhật user thất bại hoặc không tìm thấy user.' });
        }

        const userResponse = {
            employee_id: updatedUser.employee_id,
            username: updatedUser.username,
            full_name: updatedUser.full_name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            avatarURL: updatedUser.avatarURL,
            role: updatedUser.role,
        };

        if (updatedUser.birth instanceof Date) {
            const year = updatedUser.birth.getFullYear();
            const month = (updatedUser.birth.getMonth() + 1).toString().padStart(2, '0');
            const day = updatedUser.birth.getDate().toString().padStart(2, '0');
            userResponse.birth = `${year}-${month}-${day}`;
        } else if (typeof updatedUser.birth === 'string') {
            userResponse.birth = updatedUser.birth.split('T')[0];
        }

        console.log('DEBUG: Json tra ve:', userResponse);
        res.status(200).json(userResponse);

    } catch (err) {
        console.error(`Lỗi server khi cập nhật user với ID ${requestedId}:`, err);
        if (err.code === 'ER_DUP_ENTRY' || (err.sqlMessage && (err.sqlMessage.includes('Duplicate entry') || err.sqlMessage.includes('UNIQUE constraint failed')))) {
            let errorMessage = 'Dữ liệu trùng lặp.';
            if (err.sqlMessage && err.sqlMessage.includes('email')) {
                errorMessage = 'Email đã tồn tại.';
            } else if (err.sqlMessage && err.sqlMessage.includes('phone')) {
                errorMessage = 'Số điện thoại đã tồn tại.';
            }
            return res.status(409).json({ message: errorMessage });
        }
        res.status(500).json({ message: 'Lỗi server khi cập nhật user.' });
    }
};

// 5. Xóa user: Chỉ Admin mới được xóa
exports.deleteUser = async (req, res) => {
  // Vì route đã được bảo vệ bởi authMiddleware.isAdmin,
  // chúng ta biết rằng người gọi hàm này đã là admin.
  const { id } = req.params;
  const requestedId = parseInt(id, 10); // Đảm bảo ID là số nguyên

  try {
    const result = await User.delete(requestedId); // Gọi model
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy user để xóa' });
    }
    res.json({ message: 'Xóa user thành công' });
  } catch (err) {
    console.error(`Error deleting user with ID ${id}:`, err);
    res.status(500).json({ message: 'Lỗi server khi xóa user.' });
  }
};
// controllers/user.controller.js

const User = require('../models/user.model');

const excludePassword = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users.map(user => excludePassword(user)));
  } catch (err) {
    console.error('Error fetching all users:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách user.' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const requestedId = parseInt(id, 10);

  try {
    if (req.role !== 'admin' && req.employee_id !== requestedId) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập thông tin của user này.' });
    }

    const user = await User.findById(requestedId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }
    res.json(excludePassword(user));
  } catch (err) {
    console.error(`Error fetching user with ID ${id}:`, err);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin user.' });
  }
};

exports.createUser = async (req, res) => {
  const { full_name, email, phone, birth, address, role, avatarURL, username, password } = req.body;

  if (!full_name || !phone || !birth || !role || !username || !password) {
    return res.status(400).json({ message: 'Thiếu các trường bắt buộc: full_name, phone, birth, role, username, password.' });
  }

  try {
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

    const employee_id = await User.create(newEmployeeData);

    res.status(201).json({ message: 'Tạo user thành công', employee_id });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo user.' });
  }
};

exports.updateUser = async (req, res) => {
    const requestedId = parseInt(req.params.id);
    const { email, phone, birth, ...updateFields } = req.body;

    console.log(`[UserController] Cập nhật User ID: ${requestedId}`);
    console.log('[UserController] Dữ liệu nhận được từ body:', req.body);

    const userIdFromToken = req.user.employee_id;
    const userRoleFromToken = req.user.role;

    console.log('[UserController] User Role từ token:', userRoleFromToken);
    console.log('[UserController] User ID từ token:', userIdFromToken);

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

        if (email && email !== existingUser.email) {
            const userWithNewEmail = await User.findByEmail(email);
            if (userWithNewEmail && userWithNewEmail.employee_id !== requestedId) {
                return res.status(409).json({ message: 'Email đã tồn tại cho user khác.' });
            }
        }
        if (phone && phone !== existingUser.phone) {
            const userWithNewPhone = await User.findByPhone(phone);
            if (userWithNewPhone && userWithNewPhone.employee_id !== requestedId) {
                return res.status(409).json({ message: 'Số điện thoại đã tồn tại cho user khác.' });
            }
        }

        const fieldsToUpdate = { ...updateFields };

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

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const requestedId = parseInt(id, 10);

  try {
    const result = await User.delete(requestedId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy user để xóa' });
    }
    res.json({ message: 'Xóa user thành công' });
  } catch (err) {
    console.error(`Error deleting user with ID ${id}:`, err);
    res.status(500).json({ message: 'Lỗi server khi xóa user.' });
  }
};
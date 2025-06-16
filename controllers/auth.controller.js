// controllers/auth.controller.js

const User = require('../models/user.model'); // Import User model của bạn
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt'); // Import cấu hình JWT của bạn

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // 1. Kiểm tra username và password có được cung cấp không
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu.' });
  }

  try {
    // 2. Tìm user theo username
    const user = await User.findByUsername(username);

    // 3. Kiểm tra user có tồn tại không
    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập không đúng.' });
    }

    // 4. So sánh mật khẩu đã cung cấp với mật khẩu đã hash trong DB
    const passwordIsValid = await User.comparePassword(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Mật khẩu không đúng.' });
    }

    // 5. Nếu mật khẩu đúng, tạo JWT
    const token = jwt.sign(
      {
        employee_id: user.employee_id,
        username: user.username,
        email: user.email, // Thêm email vào token nếu cần
        role: user.role // Thêm role vào token để dễ dàng kiểm tra quyền trong middleware
      },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn // Thời gian hết hạn của token
      }
    );

    // 6. Trả về token và thông tin user (trừ mật khẩu)
    const { password: _, ...userData } = user; // Loại bỏ trường password khỏi đối tượng user
    //console.log(`userData login: ${JSON.stringify(userData, null, 2)}`);
    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
      user: userData // Trả về thông tin user đã đăng nhập
    });

  } catch (err) {
    console.error('Error during user login:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
  }
};
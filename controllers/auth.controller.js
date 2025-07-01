// controllers/auth.controller.js

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu.' });
  }

  try {
    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập không đúng.' });
    }

    const passwordIsValid = await User.comparePassword(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Mật khẩu không đúng.' });
    }

    const token = jwt.sign(
      {
        employee_id: user.employee_id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn
      }
    );

    const { password: _, ...userData } = user;
    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
      user: userData
    });

  } catch (err) {
    console.error('Error during user login:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
  }
};
// middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

exports.verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Không có token được cung cấp!' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  //console.log('[AuthMiddleware] Token nhận được:', token);

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token đã hết hạn!', error: err.message });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token không hợp lệ!', error: err.message });
      }
      return res.status(401).json({ message: 'Unauthorized!', error: err.message });
    }

    // --- ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT CẦN THAY ĐỔI ---
    // Gán toàn bộ payload đã giải mã vào req.user
    // Điều này sẽ làm cho req.user có các thuộc tính: employee_id, username, email, role
    req.user = decoded;
    //console.log('[AuthMiddleware] req.user sau khi gán:', req.user); // DEBUG: Xác nhận req.user

    // Chuyển quyền điều khiển cho middleware hoặc route handler tiếp theo
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  // Middleware này sẽ được gọi SAU verifyToken,
  // nên req.user.role đã có giá trị.
  if (req.user && req.user.role && req.user.role === 'admin') { // Sửa thành req.user.role
    next();
  } else {
    res.status(403).json({ message: 'Yêu cầu quyền Admin!' });
  }
};
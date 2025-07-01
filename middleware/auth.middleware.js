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

    req.user = decoded;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Yêu cầu quyền Admin!' });
  }
};
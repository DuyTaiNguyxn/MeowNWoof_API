// config/jwt.js

module.exports = {
  secret: process.env.JWT_SECRET || 'super_secret_jwt_key_that_no_one_can_guess',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d'
};
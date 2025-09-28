const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

module.exports = generateToken;
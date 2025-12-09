const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '24h';

class AuthService {
  // Хеширование пароля
  static async hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  // Сравнение пароля с хешем
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Генерация JWT токена
  static generateToken(userId, role = 'user') {
    const payload = {
      userId,
      role,
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  }

  // Верификация токена
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Декодирование токена без верификации (для отладки)
  static decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = AuthService;

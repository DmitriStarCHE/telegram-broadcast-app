const User = require('../models/User');
const AuthService = require('../services/authService');

class AuthController {
  // Регистрация нового пользователя
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      // Проверка существования пользователя
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Хеширование пароля
      const passwordHash = await AuthService.hashPassword(password);

      // Создание пользователя
      const result = await User.create(username, email, passwordHash);
      const userId = result.lastID;

      // Генерация JWT токена
      const token = AuthService.generateToken(userId);

      // Получение данных пользователя
      const user = await User.findById(userId);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Вход пользователя
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Поиск пользователя
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Проверка пароля
      const isPasswordValid = await AuthService.comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Генерация JWT токена
      const token = AuthService.generateToken(user.id, user.role);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Обновление токена
  static async refresh(req, res, next) {
    try {
      const { userId, role } = req.user;

      // Проверка существования пользователя
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Генерация нового токена
      const token = AuthService.generateToken(userId, role);

      res.json({
        message: 'Token refreshed',
        token
      });
    } catch (error) {
      next(error);
    }
  }

  // Выход (на клиенте просто удаляется токен)
  static async logout(req, res) {
    res.json({ message: 'Logout successful' });
  }
}

module.exports = AuthController;

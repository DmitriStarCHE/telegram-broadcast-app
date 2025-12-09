const BotSettings = require('../models/BotSettings');
const User = require('../models/User');
const TelegramService = require('../services/telegramService');
const AuthService = require('../services/authService');

class SettingsController {
  // Получить настройки бота
  static async getBotSettings(req, res, next) {
    try {
      const userId = req.user.userId;

      const settings = await BotSettings.findByUserId(userId);

      if (!settings) {
        return res.json({ configured: false });
      }

      // Не отправляем полный токен на клиент (безопасность)
      const maskedToken = settings.bot_token
        ? `${settings.bot_token.substring(0, 10)}...${settings.bot_token.substring(settings.bot_token.length - 5)}`
        : null;

      res.json({
        configured: true,
        bot_token_masked: maskedToken,
        is_active: settings.is_active === 1
      });
    } catch (error) {
      next(error);
    }
  }

  // Обновить токен бота
  static async updateBotToken(req, res, next) {
    try {
      const userId = req.user.userId;
      const { bot_token } = req.body;

      // Валидация токена через Telegram API
      const validation = await TelegramService.validateToken(bot_token);

      if (!validation.valid) {
        return res.status(400).json({
          error: 'Invalid bot token',
          details: validation.error
        });
      }

      await BotSettings.createOrUpdate(userId, bot_token);

      res.json({
        message: 'Bot token updated successfully',
        bot_info: validation.botInfo
      });
    } catch (error) {
      next(error);
    }
  }

  // Проверить валидность токена
  static async testBotToken(req, res, next) {
    try {
      const userId = req.user.userId;

      const settings = await BotSettings.findByUserId(userId);

      if (!settings || !settings.bot_token) {
        return res.status(400).json({ error: 'Bot token not configured' });
      }

      const validation = await TelegramService.validateToken(settings.bot_token);

      res.json(validation);
    } catch (error) {
      next(error);
    }
  }

  // Получить профиль пользователя
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  // Обновить пароль
  static async updatePassword(req, res, next) {
    try {
      const userId = req.user.userId;
      const { old_password, new_password } = req.body;

      if (!old_password || !new_password) {
        return res.status(400).json({ error: 'Old and new passwords are required' });
      }

      if (new_password.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      // Получаем пользователя с паролем
      const user = await User.findByUsername(req.user.username);

      // Проверяем старый пароль
      const isValid = await AuthService.comparePassword(old_password, user.password_hash);

      if (!isValid) {
        return res.status(401).json({ error: 'Incorrect old password' });
      }

      // Хешируем новый пароль
      const newPasswordHash = await AuthService.hashPassword(new_password);

      await User.updatePassword(userId, newPasswordHash);

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SettingsController;

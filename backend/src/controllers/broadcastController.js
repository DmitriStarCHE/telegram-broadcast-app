const BroadcastLog = require('../models/BroadcastLog');
const BroadcastService = require('../services/broadcastService');
const BotSettings = require('../models/BotSettings');
const Chat = require('../models/Chat');

class BroadcastController {
  // Предпросмотр рассылки
  static async preview(req, res, next) {
    try {
      const userId = req.user.userId;
      const { content, variables, chatIds } = req.body;

      if (!content || !chatIds || chatIds.length === 0) {
        return res.status(400).json({ error: 'Content and chatIds are required' });
      }

      const preview = await BroadcastService.previewBroadcast(userId, content, variables, chatIds);

      res.json(preview);
    } catch (error) {
      next(error);
    }
  }

  // Отправить рассылку
  static async send(req, res, next) {
    try {
      const userId = req.user.userId;
      const { content, chatIds, templateId } = req.body;

      if (!content || !chatIds || chatIds.length === 0) {
        return res.status(400).json({ error: 'Content and chatIds are required' });
      }

      // Получаем токен бота
      const botSettings = await BotSettings.findByUserId(userId);
      if (!botSettings || !botSettings.bot_token) {
        return res.status(400).json({ error: 'Bot token not configured' });
      }

      // Получаем chat_id из БД (нужны реальные telegram chat_id)
      const chats = await Chat.findActiveByUserId(userId);
      const telegramChatIds = chats
        .filter(chat => chatIds.includes(chat.id.toString()) || chatIds.includes(chat.id))
        .map(chat => chat.chat_id);

      if (telegramChatIds.length === 0) {
        return res.status(400).json({ error: 'No valid chats found' });
      }

      // Запускаем рассылку асинхронно
      const result = await BroadcastService.startBroadcast(
        userId,
        botSettings.bot_token,
        content,
        telegramChatIds,
        templateId
      );

      res.json({
        message: 'Broadcast started',
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // Получить историю рассылок
  static async getHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit) || 50;

      const history = await BroadcastLog.findByUserId(userId, limit);

      res.json({ history });
    } catch (error) {
      next(error);
    }
  }

  // Получить детали рассылки
  static async getById(req, res, next) {
    try {
      const userId = req.user.userId;
      const broadcastId = req.params.id;

      const broadcast = await BroadcastLog.findById(broadcastId, userId);

      if (!broadcast) {
        return res.status(404).json({ error: 'Broadcast not found' });
      }

      res.json({ broadcast });
    } catch (error) {
      next(error);
    }
  }

  // Получить детальную статистику
  static async getDetails(req, res, next) {
    try {
      const userId = req.user.userId;
      const broadcastId = req.params.id;

      const broadcast = await BroadcastLog.findById(broadcastId, userId);

      if (!broadcast) {
        return res.status(404).json({ error: 'Broadcast not found' });
      }

      const details = await BroadcastLog.getDetails(broadcastId);

      res.json({
        broadcast,
        details
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BroadcastController;

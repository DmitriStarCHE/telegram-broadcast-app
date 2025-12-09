const Chat = require('../models/Chat');

class ChatController {
  // Получить все чаты пользователя
  static async getAll(req, res, next) {
    try {
      const userId = req.user.userId;
      const chats = await Chat.findByUserId(userId);

      res.json({ chats });
    } catch (error) {
      next(error);
    }
  }

  // Получить чат по ID
  static async getById(req, res, next) {
    try {
      const userId = req.user.userId;
      const chatId = req.params.id;

      const chat = await Chat.findById(chatId, userId);

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      res.json({ chat });
    } catch (error) {
      next(error);
    }
  }

  // Создать новый чат
  static async create(req, res, next) {
    try {
      const userId = req.user.userId;
      const { chat_id, chat_name, description } = req.body;

      const result = await Chat.create(userId, chat_id, chat_name, description);

      const newChat = await Chat.findById(result.lastID, userId);

      res.status(201).json({
        message: 'Chat created successfully',
        chat: newChat
      });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({ error: 'Chat already exists' });
      }
      next(error);
    }
  }

  // Обновить чат
  static async update(req, res, next) {
    try {
      const userId = req.user.userId;
      const chatId = req.params.id;
      const { chat_name, description } = req.body;

      const result = await Chat.update(chatId, userId, chat_name, description);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      const updatedChat = await Chat.findById(chatId, userId);

      res.json({
        message: 'Chat updated successfully',
        chat: updatedChat
      });
    } catch (error) {
      next(error);
    }
  }

  // Удалить чат
  static async delete(req, res, next) {
    try {
      const userId = req.user.userId;
      const chatId = req.params.id;

      const result = await Chat.delete(chatId, userId);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      res.json({ message: 'Chat deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Активировать/деактивировать чат
  static async toggle(req, res, next) {
    try {
      const userId = req.user.userId;
      const chatId = req.params.id;
      const { is_active } = req.body;

      const result = await Chat.toggleActive(chatId, userId, is_active);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      res.json({
        message: 'Chat status updated successfully',
        is_active
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ChatController;

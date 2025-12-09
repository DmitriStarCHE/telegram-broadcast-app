const TelegramBot = require('node-telegram-bot-api');

class TelegramService {
  // Валидация токена бота
  static async validateToken(token) {
    try {
      const bot = new TelegramBot(token, { polling: false });
      const botInfo = await bot.getMe();

      return {
        valid: true,
        botInfo: {
          id: botInfo.id,
          username: botInfo.username,
          first_name: botInfo.first_name
        }
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // Отправка сообщения в чат
  static async sendMessage(token, chatId, text, options = {}) {
    try {
      const bot = new TelegramBot(token, { polling: false });

      const message = await bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        ...options
      });

      return {
        success: true,
        messageId: message.message_id,
        chatId: message.chat.id
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.response?.statusCode || null
      };
    }
  }

  // Получение информации о чате
  static async getChatInfo(token, chatId) {
    try {
      const bot = new TelegramBot(token, { polling: false });
      const chat = await bot.getChat(chatId);

      return {
        success: true,
        chat: {
          id: chat.id,
          type: chat.type,
          title: chat.title || chat.first_name || 'Unknown',
          username: chat.username || null
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Обработка ошибок Telegram API
  static handleTelegramError(error) {
    const statusCode = error.response?.statusCode;
    const errorMessage = error.message;

    const errorMap = {
      400: 'Bad Request: Invalid chat_id or message format',
      401: 'Unauthorized: Invalid bot token',
      403: 'Forbidden: Bot was blocked by the user or not added to the chat',
      404: 'Not Found: Chat not found',
      429: 'Too Many Requests: Rate limit exceeded, please try again later'
    };

    return {
      code: statusCode,
      message: errorMap[statusCode] || errorMessage,
      originalError: errorMessage
    };
  }

  // Отправка сообщения с задержкой (для массовой рассылки)
  static async sendMessageWithDelay(token, chatId, text, delay = 100) {
    await new Promise(resolve => setTimeout(resolve, delay));
    return await this.sendMessage(token, chatId, text);
  }
}

module.exports = TelegramService;

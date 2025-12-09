const TelegramService = require('./telegramService');
const BroadcastLog = require('../models/BroadcastLog');
const Chat = require('../models/Chat');

class BroadcastService {
  // Подстановка переменных в шаблон
  static applyVariables(content, variables) {
    let result = content;

    if (variables && typeof variables === 'object') {
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(regex, variables[key] || '');
      });
    }

    return result;
  }

  // Массовая рассылка
  static async broadcastMessages(userId, token, messageContent, chatIds, broadcastLogId) {
    let successCount = 0;
    let failCount = 0;

    // Обновляем статус на 'in_progress'
    await BroadcastLog.updateStatus(broadcastLogId, 'in_progress');

    // Отправляем сообщения с задержками
    for (const chatId of chatIds) {
      try {
        // Создаем запись детали
        await BroadcastLog.createDetail(broadcastLogId, chatId);

        // Отправляем сообщение с задержкой 150ms
        const result = await TelegramService.sendMessageWithDelay(token, chatId, messageContent, 150);

        if (result.success) {
          // Успешная отправка
          await BroadcastLog.updateDetail(
            broadcastLogId,
            chatId,
            'sent',
            result.messageId.toString()
          );
          await BroadcastLog.incrementSuccess(broadcastLogId);
          successCount++;
        } else {
          // Ошибка отправки
          await BroadcastLog.updateDetail(
            broadcastLogId,
            chatId,
            'failed',
            null,
            result.error
          );
          await BroadcastLog.incrementFailed(broadcastLogId);
          failCount++;
        }
      } catch (error) {
        // Критическая ошибка
        await BroadcastLog.updateDetail(
          broadcastLogId,
          chatId,
          'failed',
          null,
          error.message
        );
        await BroadcastLog.incrementFailed(broadcastLogId);
        failCount++;
      }
    }

    // Обновляем статус на 'completed'
    await BroadcastLog.updateStatus(broadcastLogId, 'completed');

    return {
      broadcastLogId,
      totalChats: chatIds.length,
      successfulSends: successCount,
      failedSends: failCount
    };
  }

  // Предпросмотр рассылки
  static async previewBroadcast(userId, content, variables, chatIds) {
    // Применяем переменные
    const finalContent = this.applyVariables(content, variables);

    // Получаем информацию о чатах
    const chats = [];
    for (const chatId of chatIds) {
      const chat = await Chat.findById(chatId, userId);
      if (chat) {
        chats.push({
          id: chat.id,
          chat_id: chat.chat_id,
          chat_name: chat.chat_name,
          is_active: chat.is_active
        });
      }
    }

    return {
      previewContent: finalContent,
      chats,
      totalRecipients: chats.filter(c => c.is_active).length
    };
  }

  // Запуск рассылки (асинхронно)
  static async startBroadcast(userId, token, messageContent, chatIds, templateId = null) {
    // Создаем лог рассылки
    const result = await BroadcastLog.create(userId, messageContent, chatIds.length, templateId);
    const broadcastLogId = result.lastID;

    // Запускаем рассылку асинхронно (не блокируем ответ)
    setImmediate(() => {
      this.broadcastMessages(userId, token, messageContent, chatIds, broadcastLogId)
        .catch(err => console.error('Broadcast error:', err));
    });

    return {
      broadcastLogId,
      status: 'started',
      totalChats: chatIds.length
    };
  }
}

module.exports = BroadcastService;

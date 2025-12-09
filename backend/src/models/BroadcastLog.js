const { runQuery, getOne, getAll } = require('../config/database');

class BroadcastLog {
  static async create(userId, messageContent, totalChats, templateId = null) {
    const sql = `
      INSERT INTO broadcast_logs (user_id, template_id, message_content, total_chats, status)
      VALUES (?, ?, ?, ?, 'pending')
    `;
    return await runQuery(sql, [userId, templateId, messageContent, totalChats]);
  }

  static async findById(id, userId) {
    const sql = `
      SELECT * FROM broadcast_logs
      WHERE id = ? AND user_id = ?
    `;
    return await getOne(sql, [id, userId]);
  }

  static async findByUserId(userId, limit = 50) {
    const sql = `
      SELECT * FROM broadcast_logs
      WHERE user_id = ?
      ORDER BY started_at DESC
      LIMIT ?
    `;
    return await getAll(sql, [userId, limit]);
  }

  static async updateStatus(id, status) {
    const sql = `
      UPDATE broadcast_logs
      SET status = ?, completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    return await runQuery(sql, [status, id]);
  }

  static async updateCounts(id, successfulSends, failedSends) {
    const sql = `
      UPDATE broadcast_logs
      SET successful_sends = ?, failed_sends = ?
      WHERE id = ?
    `;
    return await runQuery(sql, [successfulSends, failedSends, id]);
  }

  static async incrementSuccess(id) {
    const sql = `
      UPDATE broadcast_logs
      SET successful_sends = successful_sends + 1
      WHERE id = ?
    `;
    return await runQuery(sql, [id]);
  }

  static async incrementFailed(id) {
    const sql = `
      UPDATE broadcast_logs
      SET failed_sends = failed_sends + 1
      WHERE id = ?
    `;
    return await runQuery(sql, [id]);
  }

  // Детали рассылки
  static async createDetail(broadcastLogId, chatId) {
    const sql = `
      INSERT INTO broadcast_details (broadcast_log_id, chat_id, status)
      VALUES (?, ?, 'pending')
    `;
    return await runQuery(sql, [broadcastLogId, chatId]);
  }

  static async updateDetail(broadcastLogId, chatId, status, telegramMessageId = null, errorMessage = null) {
    const sql = `
      UPDATE broadcast_details
      SET status = ?, telegram_message_id = ?, error_message = ?, sent_at = CURRENT_TIMESTAMP
      WHERE broadcast_log_id = ? AND chat_id = ?
    `;
    return await runQuery(sql, [status, telegramMessageId, errorMessage, broadcastLogId, chatId]);
  }

  static async getDetails(broadcastLogId) {
    const sql = `
      SELECT * FROM broadcast_details
      WHERE broadcast_log_id = ?
      ORDER BY sent_at DESC
    `;
    return await getAll(sql, [broadcastLogId]);
  }
}

module.exports = BroadcastLog;

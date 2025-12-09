const { runQuery, getOne, getAll } = require('../config/database');

class Chat {
  static async create(userId, chatId, chatName, description = null) {
    const sql = `
      INSERT INTO chats (user_id, chat_id, chat_name, description)
      VALUES (?, ?, ?, ?)
    `;
    return await runQuery(sql, [userId, chatId, chatName, description]);
  }

  static async findByUserId(userId) {
    const sql = `
      SELECT * FROM chats
      WHERE user_id = ?
      ORDER BY added_at DESC
    `;
    return await getAll(sql, [userId]);
  }

  static async findById(id, userId) {
    const sql = `
      SELECT * FROM chats
      WHERE id = ? AND user_id = ?
    `;
    return await getOne(sql, [id, userId]);
  }

  static async update(id, userId, chatName, description) {
    const sql = `
      UPDATE chats
      SET chat_name = ?, description = ?
      WHERE id = ? AND user_id = ?
    `;
    return await runQuery(sql, [chatName, description, id, userId]);
  }

  static async delete(id, userId) {
    const sql = `
      DELETE FROM chats
      WHERE id = ? AND user_id = ?
    `;
    return await runQuery(sql, [id, userId]);
  }

  static async toggleActive(id, userId, isActive) {
    const sql = `
      UPDATE chats
      SET is_active = ?
      WHERE id = ? AND user_id = ?
    `;
    return await runQuery(sql, [isActive ? 1 : 0, id, userId]);
  }

  static async findActiveByUserId(userId) {
    const sql = `
      SELECT * FROM chats
      WHERE user_id = ? AND is_active = 1
      ORDER BY added_at DESC
    `;
    return await getAll(sql, [userId]);
  }
}

module.exports = Chat;

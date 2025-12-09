const { runQuery, getOne } = require('../config/database');

class BotSettings {
  static async createOrUpdate(userId, botToken) {
    // Проверяем существование настроек
    const existing = await this.findByUserId(userId);

    if (existing) {
      // Обновляем существующие
      const sql = `
        UPDATE bot_settings
        SET bot_token = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `;
      return await runQuery(sql, [botToken, userId]);
    } else {
      // Создаём новые
      const sql = `
        INSERT INTO bot_settings (user_id, bot_token)
        VALUES (?, ?)
      `;
      return await runQuery(sql, [userId, botToken]);
    }
  }

  static async findByUserId(userId) {
    const sql = `
      SELECT * FROM bot_settings
      WHERE user_id = ?
    `;
    return await getOne(sql, [userId]);
  }

  static async setActive(userId, isActive) {
    const sql = `
      UPDATE bot_settings
      SET is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `;
    return await runQuery(sql, [isActive ? 1 : 0, userId]);
  }

  static async delete(userId) {
    const sql = `
      DELETE FROM bot_settings
      WHERE user_id = ?
    `;
    return await runQuery(sql, [userId]);
  }
}

module.exports = BotSettings;

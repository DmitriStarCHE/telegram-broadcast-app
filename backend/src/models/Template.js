const { runQuery, getOne, getAll } = require('../config/database');

class Template {
  static async createOrUpdate(userId, slotNumber, title, content, variables = null) {
    // Проверяем существование шаблона
    const existing = await this.findBySlot(userId, slotNumber);

    const variablesJson = variables ? JSON.stringify(variables) : null;

    if (existing) {
      // Обновляем существующий
      const sql = `
        UPDATE templates
        SET title = ?, content = ?, variables = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND slot_number = ?
      `;
      return await runQuery(sql, [title, content, variablesJson, userId, slotNumber]);
    } else {
      // Создаём новый
      const sql = `
        INSERT INTO templates (user_id, slot_number, title, content, variables)
        VALUES (?, ?, ?, ?, ?)
      `;
      return await runQuery(sql, [userId, slotNumber, title, content, variablesJson]);
    }
  }

  static async findBySlot(userId, slotNumber) {
    const sql = `
      SELECT * FROM templates
      WHERE user_id = ? AND slot_number = ?
    `;
    const result = await getOne(sql, [userId, slotNumber]);

    // Парсим JSON переменные если есть
    if (result && result.variables) {
      try {
        result.variables = JSON.parse(result.variables);
      } catch (e) {
        result.variables = null;
      }
    }

    return result;
  }

  static async findAllByUserId(userId) {
    const sql = `
      SELECT * FROM templates
      WHERE user_id = ?
      ORDER BY slot_number ASC
    `;
    const results = await getAll(sql, [userId]);

    // Парсим JSON переменные для всех шаблонов
    return results.map(template => {
      if (template.variables) {
        try {
          template.variables = JSON.parse(template.variables);
        } catch (e) {
          template.variables = null;
        }
      }
      return template;
    });
  }

  static async delete(userId, slotNumber) {
    const sql = `
      DELETE FROM templates
      WHERE user_id = ? AND slot_number = ?
    `;
    return await runQuery(sql, [userId, slotNumber]);
  }

  static async findById(id) {
    const sql = `SELECT * FROM templates WHERE id = ?`;
    const result = await getOne(sql, [id]);

    if (result && result.variables) {
      try {
        result.variables = JSON.parse(result.variables);
      } catch (e) {
        result.variables = null;
      }
    }

    return result;
  }
}

module.exports = Template;

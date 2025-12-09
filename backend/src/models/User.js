const { runQuery, getOne, getAll } = require('../config/database');

class User {
  static async create(username, email, passwordHash) {
    const sql = `
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `;
    return await runQuery(sql, [username, email, passwordHash]);
  }

  static async findByUsername(username) {
    const sql = `SELECT * FROM users WHERE username = ?`;
    return await getOne(sql, [username]);
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    return await getOne(sql, [email]);
  }

  static async findById(id) {
    const sql = `SELECT id, username, email, role, created_at FROM users WHERE id = ?`;
    return await getOne(sql, [id]);
  }

  static async updatePassword(userId, newPasswordHash) {
    const sql = `
      UPDATE users
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    return await runQuery(sql, [newPasswordHash, userId]);
  }

  static async getAll() {
    const sql = `SELECT id, username, email, role, created_at FROM users`;
    return await getAll(sql);
  }
}

module.exports = User;

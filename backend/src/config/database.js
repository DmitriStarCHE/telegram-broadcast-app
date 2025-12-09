const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, '../../', process.env.DATABASE_PATH || './data/database.sqlite');

// Создание подключения к БД
function getDbConnection() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err.message);
        reject(err);
      } else {
        // Включить foreign keys
        db.run('PRAGMA foreign_keys = ON');
        resolve(db);
      }
    });
  });
}

// Вспомогательная функция для выполнения запросов
function runQuery(sql, params = []) {
  return new Promise(async (resolve, reject) => {
    const db = await getDbConnection();
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
      db.close();
    });
  });
}

// Вспомогательная функция для получения одной записи
function getOne(sql, params = []) {
  return new Promise(async (resolve, reject) => {
    const db = await getDbConnection();
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
      db.close();
    });
  });
}

// Вспомогательная функция для получения всех записей
function getAll(sql, params = []) {
  return new Promise(async (resolve, reject) => {
    const db = await getDbConnection();
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
      db.close();
    });
  });
}

module.exports = {
  getDbConnection,
  runQuery,
  getOne,
  getAll,
  dbPath
};

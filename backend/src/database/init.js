const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, '../../', process.env.DATABASE_PATH || './data/database.sqlite');

// Создание папки data если её нет
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Инициализация базы данных
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
    });

    // Включить foreign keys
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) {
        console.error('Error enabling foreign keys:', err.message);
      }
    });

    // Читаем файл миграции
    const migrationPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');

    // Выполняем миграцию
    db.exec(migration, (err) => {
      if (err) {
        console.error('Error running migration:', err.message);
        reject(err);
        return;
      }
      console.log('Database schema initialized successfully');

      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

module.exports = { initializeDatabase, dbPath };

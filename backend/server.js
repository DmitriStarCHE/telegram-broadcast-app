const app = require('./src/app');
const { initializeDatabase } = require('./src/database/init');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Инициализация базы данных и запуск сервера
async function startServer() {
  try {
    // Инициализируем БД
    console.log('Initializing database...');
    await initializeDatabase();

    // Запускаем сервер
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

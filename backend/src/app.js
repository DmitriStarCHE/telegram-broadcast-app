const express = require('express');
const cors = require('cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
require('dotenv').config();

// Импорт роутов
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chats');
const templateRoutes = require('./routes/templates');
const broadcastRoutes = require('./routes/broadcast');
const settingsRoutes = require('./routes/settings');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check эндпоинт
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API роуты
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/broadcast', broadcastRoutes);
app.use('/api/settings', settingsRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler (должен быть последним)
app.use(errorHandler);

module.exports = app;

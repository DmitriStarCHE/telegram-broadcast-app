const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settingsController');
const { validateBotToken } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Все роуты требуют авторизации
router.use(authenticateToken);

// GET /api/settings/bot - получить настройки бота
router.get('/bot', SettingsController.getBotSettings);

// PUT /api/settings/bot - обновить токен бота
router.put('/bot', validateBotToken, SettingsController.updateBotToken);

// POST /api/settings/bot/test - проверить токен бота
router.post('/bot/test', SettingsController.testBotToken);

// GET /api/settings/profile - получить профиль
router.get('/profile', SettingsController.getProfile);

// PUT /api/settings/password - обновить пароль
router.put('/password', SettingsController.updatePassword);

module.exports = router;

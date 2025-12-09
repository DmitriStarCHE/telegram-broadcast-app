const express = require('express');
const router = express.Router();
const BroadcastController = require('../controllers/broadcastController');
const { validateBroadcast } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Все роуты требуют авторизации
router.use(authenticateToken);

// POST /api/broadcast/preview - предпросмотр рассылки
router.post('/preview', BroadcastController.preview);

// POST /api/broadcast/send - отправить рассылку
router.post('/send', validateBroadcast, BroadcastController.send);

// GET /api/broadcast/history - история рассылок
router.get('/history', BroadcastController.getHistory);

// GET /api/broadcast/:id - получить рассылку по ID
router.get('/:id', BroadcastController.getById);

// GET /api/broadcast/:id/details - детальная статистика
router.get('/:id/details', BroadcastController.getDetails);

module.exports = router;

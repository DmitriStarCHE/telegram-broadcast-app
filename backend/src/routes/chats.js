const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');
const { validateChat } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Все роуты требуют авторизации
router.use(authenticateToken);

// GET /api/chats - получить все чаты
router.get('/', ChatController.getAll);

// GET /api/chats/:id - получить чат по ID
router.get('/:id', ChatController.getById);

// POST /api/chats - создать чат
router.post('/', validateChat, ChatController.create);

// PUT /api/chats/:id - обновить чат
router.put('/:id', ChatController.update);

// DELETE /api/chats/:id - удалить чат
router.delete('/:id', ChatController.delete);

// PATCH /api/chats/:id/toggle - изменить статус активности
router.patch('/:id/toggle', ChatController.toggle);

module.exports = router;

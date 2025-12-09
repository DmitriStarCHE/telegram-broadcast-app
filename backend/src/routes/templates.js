const express = require('express');
const router = express.Router();
const TemplateController = require('../controllers/templateController');
const { validateTemplate } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Все роуты требуют авторизации
router.use(authenticateToken);

// GET /api/templates - получить все шаблоны
router.get('/', TemplateController.getAll);

// GET /api/templates/:slot - получить шаблон по слоту
router.get('/:slot', TemplateController.getBySlot);

// POST /api/templates - создать/обновить шаблон
router.post('/', validateTemplate, TemplateController.createOrUpdate);

// PUT /api/templates/:slot - обновить шаблон
router.put('/:slot', TemplateController.createOrUpdate);

// DELETE /api/templates/:slot - удалить шаблон
router.delete('/:slot', TemplateController.delete);

module.exports = router;

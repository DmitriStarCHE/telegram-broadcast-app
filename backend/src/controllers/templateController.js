const Template = require('../models/Template');

class TemplateController {
  // Получить все шаблоны пользователя
  static async getAll(req, res, next) {
    try {
      const userId = req.user.userId;
      const templates = await Template.findAllByUserId(userId);

      // Заполняем все 3 слота (даже пустые)
      const slots = [1, 2, 3].map(slot => {
        const template = templates.find(t => t.slot_number === slot);
        return template || { slot_number: slot, empty: true };
      });

      res.json({ templates: slots });
    } catch (error) {
      next(error);
    }
  }

  // Получить шаблон по слоту
  static async getBySlot(req, res, next) {
    try {
      const userId = req.user.userId;
      const slot = parseInt(req.params.slot);

      if (slot < 1 || slot > 3) {
        return res.status(400).json({ error: 'Slot number must be between 1 and 3' });
      }

      const template = await Template.findBySlot(userId, slot);

      if (!template) {
        return res.json({ slot_number: slot, empty: true });
      }

      res.json({ template });
    } catch (error) {
      next(error);
    }
  }

  // Создать или обновить шаблон
  static async createOrUpdate(req, res, next) {
    try {
      const userId = req.user.userId;
      const { slot_number, title, content, variables } = req.body;

      await Template.createOrUpdate(userId, slot_number, title, content, variables);

      const template = await Template.findBySlot(userId, slot_number);

      res.json({
        message: 'Template saved successfully',
        template
      });
    } catch (error) {
      next(error);
    }
  }

  // Удалить шаблон
  static async delete(req, res, next) {
    try {
      const userId = req.user.userId;
      const slot = parseInt(req.params.slot);

      if (slot < 1 || slot > 3) {
        return res.status(400).json({ error: 'Slot number must be between 1 and 3' });
      }

      const result = await Template.delete(userId, slot);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Template not found' });
      }

      res.json({ message: 'Template deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TemplateController;

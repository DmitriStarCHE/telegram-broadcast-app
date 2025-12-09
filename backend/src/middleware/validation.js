const { body, param, validationResult } = require('express-validator');

// Проверка результатов валидации
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Валидация регистрации
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  validate
];

// Валидация логина
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validate
];

// Валидация чата
const validateChat = [
  body('chat_id')
    .trim()
    .notEmpty()
    .withMessage('Chat ID is required')
    .matches(/^-?\d+$/)
    .withMessage('Chat ID must be a number'),

  body('chat_name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Chat name must be between 1 and 255 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),

  validate
];

// Валидация шаблона
const validateTemplate = [
  body('slot_number')
    .isInt({ min: 1, max: 3 })
    .withMessage('Slot number must be between 1 and 3'),

  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),

  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),

  body('variables')
    .optional()
    .isArray()
    .withMessage('Variables must be an array'),

  validate
];

// Валидация рассылки
const validateBroadcast = [
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Message content is required'),

  body('chatIds')
    .isArray({ min: 1 })
    .withMessage('At least one chat ID is required'),

  validate
];

// Валидация Bot Token
const validateBotToken = [
  body('bot_token')
    .trim()
    .notEmpty()
    .withMessage('Bot token is required')
    .matches(/^\d+:[A-Za-z0-9_-]+$/)
    .withMessage('Invalid bot token format'),

  validate
];

module.exports = {
  validate,
  validateRegistration,
  validateLogin,
  validateChat,
  validateTemplate,
  validateBroadcast,
  validateBotToken
};

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', validateRegistration, AuthController.register);

// POST /api/auth/login
router.post('/login', validateLogin, AuthController.login);

// POST /api/auth/refresh (требует токен)
router.post('/refresh', authenticateToken, AuthController.refresh);

// POST /api/auth/logout (требует токен)
router.post('/logout', authenticateToken, AuthController.logout);

module.exports = router;

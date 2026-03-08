const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { signupSchema, loginSchema, validate } = require('../validators/authValidator');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', protect, logout);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  registerController,
  loginController,
  getMeController
} = require('../controllers/authController');
const protect = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

router.post(
  '/register',
  authLimiter,
  validate({
    name: { required: true, minLength: 2 },
    email: { required: true, type: 'email' },
    password: { required: true, minLength: 6 }
  }),
  registerController
);

router.post('/login', authLimiter, loginController);

router.get('/me', protect, getMeController);

module.exports = router;
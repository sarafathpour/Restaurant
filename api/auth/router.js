const express = require("express");
const router = express.Router();
const { protect } = require("@middlewares/security");
const { login, register, getMe } = require('./controller');
// const { loginValidation, registerValidation } = require('./validation');

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);

module.exports = router;
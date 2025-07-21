const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth');
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', authenticate, getProfile);
router.put('/update', authenticate, updateProfile);

module.exports = router;

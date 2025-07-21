const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/me', verifyToken, getProfile);
router.put('/update', verifyToken, updateProfile);

module.exports = router;

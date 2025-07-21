const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth'); // ✅ this must exist and export `authenticate`
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} = require('../controllers/userController'); // ✅ make sure all 4 functions are exported

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getProfile);
router.put('/update', authenticate, updateProfile);

module.exports = router;

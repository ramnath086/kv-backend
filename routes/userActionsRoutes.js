const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  shortlistUser,
  getShortlistedUsers,
  blockUser,
  getBlockedUsers,
} = require('../controllers/userActionsController');

router.post('/shortlist/:userId', authenticate, shortlistUser);
router.get('/shortlisted', authenticate, getShortlistedUsers);

router.post('/block/:userId', authenticate, blockUser);
router.get('/blocked', authenticate, getBlockedUsers);

module.exports = router;

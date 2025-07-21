const express = require('express');
const router = express.Router();
const { searchMatches } = require('../controllers/matchController');
const { authenticate } = require('../middleware/auth');

router.get('/search', authenticate, searchMatches);

module.exports = router;

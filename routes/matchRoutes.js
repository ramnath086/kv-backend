const express = require('express');
const router = express.Router();
const { searchMatches } = require('../controllers/matchController');
const { verifyToken } = require('../middleware/auth');

router.get('/search', verifyToken, searchMatches);

module.exports = router;

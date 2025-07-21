const express = require('express');
const router = express.Router();
const { getAllUsers, approveUser, deleteUser } = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/users', authenticate, isAdmin, getAllUsers);
router.put('/approve/:userId', authenticate, isAdmin, approveUser);
router.delete('/delete/:userId', authenticate, isAdmin, deleteUser);
router.get('/users', authenticate, isAdmin, getAllUsers);

module.exports = router;

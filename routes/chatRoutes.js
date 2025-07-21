const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// ✅ Save message
router.post('/save', authenticate, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const sender = await User.findById(req.user._id);
    const receiver = await User.findById(receiverId);

    // ❌ Block/approval checks
    if (!receiver || receiver.blocked.includes(sender._id) || sender.blocked.includes(receiver._id)) {
      return res.status(403).json({ message: 'User is blocked or cannot be messaged' });
    }

    if (!sender.isApproved || !receiver.isApproved) {
      return res.status(403).json({ message: 'Both users must be approved to chat' });
    }

    const msg = new Message({ sender: sender._id, receiver: receiver._id, text });
    await msg.save();
    res.status(201).json({ message: 'Message saved' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving message' });
  }
});

// ✅ Fetch chat history
router.get('/history/:receiverId', authenticate, async (req, res) => {
  try {
    const sender = await User.findById(req.user._id);
    const receiver = await User.findById(req.params.receiverId);

    // ❌ Block/approval checks
    if (!receiver || receiver.blocked.includes(sender._id) || sender.blocked.includes(receiver._id)) {
      return res.status(403).json({ message: 'User is blocked or cannot be viewed' });
    }

    if (!sender.isApproved || !receiver.isApproved) {
      return res.status(403).json({ message: 'Both users must be approved to chat' });
    }

    const messages = await Message.find({
      $or: [
        { sender: sender._id, receiver: receiver._id },
        { sender: receiver._id, receiver: sender._id }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;

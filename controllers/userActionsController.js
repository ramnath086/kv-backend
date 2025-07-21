const User = require('../models/User');

exports.shortlistUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { userId } = req.params;

    if (!user.shortlisted.includes(userId)) {
      user.shortlisted.push(userId);
      await user.save();
    }

    res.json({ message: 'User shortlisted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Shortlist failed' });
  }
};

exports.getShortlistedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('shortlisted', '-password');
    res.json(user.shortlisted);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving shortlisted users' });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { userId } = req.params;

    if (!user.blocked.includes(userId)) {
      user.blocked.push(userId);
      await user.save();
    }

    res.json({ message: 'User blocked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Block failed' });
  }
};

exports.getBlockedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('blocked', '-password');
    res.json(user.blocked);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving blocked users' });
  }
};

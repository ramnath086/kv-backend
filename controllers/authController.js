const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTPViaFirebase, verifyOTPViaFirebase } = require('../utils/firebase');
const { generateToken } = require('../utils/jwt');

exports.registerUser = async (req, res) => {
  const { name, email, mobile } = req.body;
  try {
    let user = await User.findOne({ $or: [{ email }, { mobile }] });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Send OTP via Firebase
    await sendOTPViaFirebase(mobile);

    const newUser = new User({ name, email, mobile });
    await newUser.save();
    res.status(201).json({ message: 'OTP sent', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await verifyOTPViaFirebase(user.mobile, otp);
    if (!valid) return res.status(400).json({ message: 'Invalid OTP' });

    user.isVerified = true;
    await user.save();

    const token = generateToken(user._id);
    res.json({ message: 'Verified successfully', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { emailOrMobile, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }] });
    if (!user || !user.isVerified) return res.status(401).json({ message: 'Unauthorized' });

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { googleId, email, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, isVerified: true });
    }
    const token = generateToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

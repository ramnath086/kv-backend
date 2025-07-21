const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
shortlisted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  name: String,
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  password: String,
  otp: String,
  isVerified: { type: Boolean, default: false },
  googleId: String, photo: String,
  gender: String,
  dob: Date,
  religion: String,
  caste: String,
  language: String,
  profession: String,
  income: String,
  bio: String,
  horoscope: String,
  preferences: {
    ageRange: { min: Number, max: Number },
    religion: String,
    caste: String,
    language: String,
    profession: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

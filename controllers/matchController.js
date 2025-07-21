const User = require('../models/User');

exports.searchMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const preferences = currentUser.preferences || {};

    const allUsers = await User.find({ _id: { $ne: req.userId } }).select('-password -otp -__v');

    const calculateScore = (user) => {
      let score = 0;

      // Age compatibility
      if (user.dob && preferences.ageRange?.min && preferences.ageRange?.max) {
        const age = Math.floor((new Date() - new Date(user.dob)) / (365.25 * 24 * 60 * 60 * 1000));
        if (age >= preferences.ageRange.min && age <= preferences.ageRange.max) {
          score += 20;
        }
      }

      // Religion
      if (preferences.religion && preferences.religion === user.religion) {
        score += 15;
      }

      // Caste
      if (preferences.caste && preferences.caste === user.caste) {
        score += 15;
      }

      // Language
      if (preferences.language && preferences.language === user.language) {
        score += 15;
      }

      // Profession
      if (preferences.profession && preferences.profession === user.profession) {
        score += 15;
      }

      // Income
      if (preferences.income && preferences.income === user.income) {
        score += 10;
      }

      return score;
    };

    const matchesWithScores = allUsers.map((user) => ({
      ...user._doc,
      score: calculateScore(user),
    }));

    matchesWithScores.sort((a, b) => b.score - a.score);

    res.json(matchesWithScores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

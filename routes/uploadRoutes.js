const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/profile-photo', auth, upload.single('photo'), async (req, res) => {
  try {
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'vivahconnect-profiles',
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { photoUrl: uploadedResponse.secure_url },
      { new: true }
    );

    res.json({ message: 'Photo uploaded successfully', photoUrl: user.photoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;

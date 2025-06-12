const express = require('express');
const multer = require('multer');
const path = require('path');
const Audio = require('../models/Audio');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const audio = new Audio({
      title: req.body.title,
      filename: req.file.filename,
    });
    await audio.save();

    res.status(201).json({
      _id: audio._id,
      title: audio.title,
      url: `${process.env.BASE_URL}/uploads/${audio.filename}`
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const audioList = await Audio.find().sort({ createdAt: -1 });
    const response = audioList.map((audio) => ({
      _id: audio._id,
      title: audio.title,
      url: `${process.env.BASE_URL}/uploads/${audio.filename}`
    }));
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

module.exports = router;

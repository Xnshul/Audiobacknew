// backend/routes/audioRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Audio = require('../models/Audio');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { title } = req.body;
    const filePath = req.file.path;

    const newAudio = new Audio({ title, filePath });
    // console.log("newAudio", newAudio)

    await newAudio.save();

    res.status(201).json(newAudio);
  } catch (err) {
    res.status(500).json({ message: 'Upload error', error: err.message });
  }
});

router.get('/', async (req, res) => {
  const audios = await Audio.find().sort({ createdAt: -1 });
  res.json(audios);
});

module.exports = router;

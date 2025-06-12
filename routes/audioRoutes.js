const express = require('express');
const multer = require('multer');
const path = require('path');
const Audio = require('../models/Audio');

const router = express.Router();


const upload = multer({ storage: multer.memoryStorage() });


router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file || !title) {
      return res.status(400).json({ message: 'Title and audio file required' });
    }

    const audio = new Audio({
      title,
      mimetype: file.mimetype,
      audioData: file.buffer
    });

    await audio.save();

    res.status(201).json({
      _id: audio._id,
      title: audio.title,
      url: `${process.env.BASE_URL}/api/audio/${audio._id}` 
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const audioList = await Audio.find().sort({ createdAt: -1 });
    const mapped = audioList.map((audio) => ({
      _id: audio._id,
      title: audio.title,
      url: `${process.env.BASE_URL}/api/audio/${audio._id}`
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({ message: 'Audio not found' });
    }

    res.set('Content-Type', audio.mimetype);
    res.send(audio.audioData);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

module.exports = router;

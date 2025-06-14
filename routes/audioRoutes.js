const express = require('express');
const multer = require('multer');
const Audio = require('../models/Audio');
const router = express.Router();

// Multer setup to handle memory storage (we store in MongoDB, not file system)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/audio — Upload audio
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: 'Title and audio file are required' });
    }

    const newAudio = new Audio({
      title,
      contentType: req.file.mimetype,
      data: req.file.buffer,
    });

    const savedAudio = await newAudio.save();

    res.status(201).json({
      _id: savedAudio._id,
      title: savedAudio.title,
      url: `${req.protocol}://${req.get('host')}/api/audio/${savedAudio._id}`,
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Failed to upload audio', error: err.message });
  }
});

// GET /api/audio — List all recordings
router.get('/', async (req, res) => {
  try {
    const audios = await Audio.find().sort({ createdAt: -1 });

    const audioList = audios.map((audio) => ({
      _id: audio._id,
      title: audio.title,
      url: `${req.protocol}://${req.get('host')}/api/audio/${audio._id}`,
    }));

    res.json(audioList);
  } catch (err) {
    console.error('Fetch List Error:', err);
    res.status(500).json({ message: 'Failed to fetch audio list', error: err.message });
  }
});

// GET /api/audio/:id — Stream a specific recording
router.get('/play/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).send('Audio not found');

    res.set('Content-Type', audio.contentType || 'audio/webm');
    res.send(audio.data);
  } catch (err) {
    console.error('Stream error:', err);
    res.status(500).json({ error: 'Failed to play audio' });
  }
});

// DELETE - Remove an audio by ID
router.delete('/:id', async (req, res) => {
  try {
    await Audio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Audio deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete audio' });
  }
});

module.exports = router;

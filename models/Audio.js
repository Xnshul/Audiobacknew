// backend/models/Audio.js
// models/Audio.js
const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mimetype: { type: String, required: true },
  audioData: { type: Buffer, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Audio', AudioSchema);


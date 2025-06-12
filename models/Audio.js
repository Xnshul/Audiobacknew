// backend/models/Audio.js
const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  title: String,
  filePath: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Audio', audioSchema);

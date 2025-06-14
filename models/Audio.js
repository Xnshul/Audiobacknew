const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audio', AudioSchema);

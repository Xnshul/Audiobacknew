const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const audioRoutes = require('./routes/audioRoutes');

const app = express();

app.use(cors({
  origin: 'https://audiobackend.onrender.com' 
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/audio', audioRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log('✅ Server + MongoDB running'));
  })
  .catch(err => console.error('❌ MongoDB error:', err));


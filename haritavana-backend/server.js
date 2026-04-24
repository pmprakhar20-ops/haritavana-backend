const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ── MIDDLEWARE ──
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── ROUTES ──
app.use('/api/products',   require('./routes/products'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/customers',  require('./routes/customers'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/delivery',   require('./routes/delivery'));
app.use('/api/settings',   require('./routes/settings'));

// ── HEALTH CHECK ──
app.get('/', (req, res) => {
  res.json({ 
    status: 'HaritaVana API is running 🌿',
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

// ── CONNECT MONGODB ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🌿 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

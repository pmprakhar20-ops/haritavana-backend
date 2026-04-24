// ── CATEGORIES ROUTE ──
const express = require('express');
const router = express.Router();
const { Category } = require('../models');

router.get('/', async (req, res) => {
  try {
    const cats = await Category.find({}).sort({ createdAt: 1 });
    res.json({ success: true, data: cats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const cat = new Category(req.body);
    await cat.save();
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Seed default categories
router.post('/seed/defaults', async (req, res) => {
  try {
    const count = await Category.countDocuments();
    if (count > 0) return res.json({ success: true, message: 'Already seeded' });
    const defaults = [
      { name:'Indoor Plants', icon:'🪴' },
      { name:'Outdoor Plants', icon:'🌳' },
      { name:'Flowering Plants', icon:'🌺' },
      { name:'Pots & Planters', icon:'🏺' },
      { name:'Seeds', icon:'🌱' },
      { name:'Fertilizers', icon:'🧪' },
      { name:'Medicinal Plants', icon:'💊' },
      { name:'Succulents', icon:'🌵' },
    ];
    await Category.insertMany(defaults);
    res.json({ success: true, message: 'Categories seeded!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

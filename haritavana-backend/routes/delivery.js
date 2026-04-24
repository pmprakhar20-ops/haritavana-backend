const express = require('express');
const router = express.Router();
const { DeliveryArea } = require('../models');

router.get('/', async (req, res) => {
  try {
    const areas = await DeliveryArea.find({}).sort({ createdAt: 1 });
    res.json({ success: true, data: areas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const area = new DeliveryArea(req.body);
    await area.save();
    res.status(201).json({ success: true, data: area });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const area = await DeliveryArea.findById(req.params.id);
    if (!area) return res.status(404).json({ success: false, message: 'Not found' });
    area.active = !area.active;
    await area.save();
    res.json({ success: true, data: area });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await DeliveryArea.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Area removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Seed defaults
router.post('/seed/defaults', async (req, res) => {
  try {
    const count = await DeliveryArea.countDocuments();
    if (count > 0) return res.json({ success: true, message: 'Already seeded' });
    await DeliveryArea.insertMany([
      { name:'Patti', district:'Pratapgarh', state:'U.P.', active:true },
      { name:'Pratapgarh City', district:'Pratapgarh', state:'U.P.', active:true },
    ]);
    res.json({ success: true, message: 'Delivery areas seeded!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

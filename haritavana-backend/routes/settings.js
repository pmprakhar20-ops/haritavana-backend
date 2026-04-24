const express = require('express');
const router = express.Router();
const { Settings } = require('../models');

// GET setting by key
router.get('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    res.json({ success: true, data: setting ? setting.value : null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT upsert setting
router.put('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { key: req.params.key, value: req.body.value },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: setting });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;

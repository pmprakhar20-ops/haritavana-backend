const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ── REVIEW SCHEMA ──
const reviewSchema = new mongoose.Schema({
  productId:     { type: String, required: true },
  productName:   { type: String, required: true },
  customerName:  { type: String, required: true },
  customerPhone: { type: String, required: true },
  orderId:       { type: String, required: true },
  rating:        { type: Number, required: true, min: 1, max: 5 },
  comment:       { type: String, default: '' },
  approved:      { type: Boolean, default: false },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

// GET reviews for a product (approved only)
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId, approved: true }).sort({ createdAt: -1 });
    const avg = reviews.length ? (reviews.reduce((s,r) => s+r.rating, 0) / reviews.length).toFixed(1) : 0;
    res.json({ success: true, data: reviews, average: parseFloat(avg), total: reviews.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all reviews (admin)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST submit review
router.post('/', async (req, res) => {
  try {
    const { productId, orderId, customerPhone } = req.body;
    // Check if already reviewed
    const existing = await Review.findOne({ productId, orderId, customerPhone });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this product!' });
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ success: true, data: review, message: 'Review submitted! It will appear after approval.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH approve/reject review (admin)
router.patch('/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: req.body.approved }, { new: true });
    res.json({ success: true, data: review, message: req.body.approved ? 'Review approved!' : 'Review rejected!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE review (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

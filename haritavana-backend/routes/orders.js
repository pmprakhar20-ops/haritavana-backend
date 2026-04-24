const express = require('express');
const router = express.Router();
const { Order, Customer } = require('../models');

// GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET orders by customer phone
router.get('/customer/:phone', async (req, res) => {
  try {
    const orders = await Order.find({ customerPhone: req.params.phone }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create order
router.post('/', async (req, res) => {
  try {
    const orderId = 'HV' + Date.now().toString().slice(-8);
    const order = new Order({ ...req.body, orderId });
    await order.save();

    // Update customer stats
    await Customer.findOneAndUpdate(
      { phone: req.body.customerPhone },
      { $inc: { orders: 1, totalSpent: req.body.total } },
    );

    res.status(201).json({ success: true, data: order, message: 'Order placed!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH update order status (admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order, message: 'Status updated!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE order (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Order.findOneAndDelete({ orderId: req.params.id });
    res.json({ success: true, message: 'Order deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

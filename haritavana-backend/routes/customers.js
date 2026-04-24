const express = require('express');
const router = express.Router();
const { Customer } = require('../models');

// GET all customers (admin)
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET customer by phone
router.get('/phone/:phone', async (req, res) => {
  try {
    const customer = await Customer.findOne({ phone: req.params.phone });
    if (!customer) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST register customer
router.post('/register', async (req, res) => {
  try {
    const exists = await Customer.findOne({ phone: req.body.phone });
    if (exists) return res.status(400).json({ success: false, message: 'Phone already registered' });
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({ success: true, data: customer, message: 'Account created!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST login customer
router.post('/login', async (req, res) => {
  try {
    const { phone, email, password } = req.body;
    const customer = await Customer.findOne(phone ? { phone } : { email });
    if (!customer) return res.status(404).json({ success: false, message: 'Account not found. Please register.' });
    if (customer.password && customer.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
    res.json({ success: true, data: customer, message: 'Login successful!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;

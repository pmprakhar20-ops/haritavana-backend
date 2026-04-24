const express = require('express');
const router = express.Router();
const { Settings } = require('../models');

const ADMIN_EMAIL = 'pmprakhar20@gmail.com';

// POST admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: 'Invalid admin email' });
    }
    // Get saved password
    const savedPw = await Settings.findOne({ key: 'adminPassword' });
    // First time — set password
    if (!savedPw || !savedPw.value) {
      if (!password) return res.status(400).json({ success: false, message: 'Set a password first' });
      await Settings.findOneAndUpdate(
        { key: 'adminPassword' },
        { key: 'adminPassword', value: password },
        { upsert: true }
      );
      return res.json({ success: true, firstTime: true, message: 'Password set! Welcome Prakhar!' });
    }
    // Check password
    if (password !== savedPw.value) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
    res.json({ success: true, message: 'Welcome back, Prakhar!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST change admin password
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const savedPw = await Settings.findOne({ key: 'adminPassword' });
    if (!savedPw || savedPw.value !== currentPassword) {
      return res.status(401).json({ success: false, message: 'Current password incorrect' });
    }
    await Settings.findOneAndUpdate(
      { key: 'adminPassword' },
      { value: newPassword },
      { new: true }
    );
    res.json({ success: true, message: 'Password changed!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const { Order, Product, Customer } = require('../models');
    const [orders, products, customers] = await Promise.all([
      Order.find({}),
      Product.find({}),
      Customer.find({}),
    ]);
    const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((s,o) => s+o.total, 0);
    const pending = orders.filter(o => o.status === 'Pending').length;
    res.json({
      success: true,
      data: {
        revenue, orders: orders.length, pending,
        products: products.length,
        activeProducts: products.filter(p=>p.active).length,
        customers: customers.length,
        recentOrders: orders.slice(0, 5),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST seed all defaults
router.post('/seed', async (req, res) => {
  try {
    const axios_like = async (url) => {
      // Internal seeding
    };
    // Trigger all seeds
    const { Category, Product, DeliveryArea } = require('../models');
    
    if (await Category.countDocuments() === 0) {
      await Category.insertMany([
        { name:'Indoor Plants', icon:'🪴' },
        { name:'Outdoor Plants', icon:'🌳' },
        { name:'Flowering Plants', icon:'🌺' },
        { name:'Pots & Planters', icon:'🏺' },
        { name:'Seeds', icon:'🌱' },
        { name:'Fertilizers', icon:'🧪' },
        { name:'Medicinal Plants', icon:'💊' },
        { name:'Succulents', icon:'🌵' },
      ]);
    }
    if (await DeliveryArea.countDocuments() === 0) {
      await DeliveryArea.insertMany([
        { name:'Patti', district:'Pratapgarh', state:'U.P.', active:true },
        { name:'Pratapgarh City', district:'Pratapgarh', state:'U.P.', active:true },
      ]);
    }
    if (await Product.countDocuments() === 0) {
      await Product.insertMany([
        { name:'Tulsi (Holy Basil)', sci:'Ocimum tenuiflorum', emoji:'🌿', cat:'Indoor Plants', price:149, mrp:199, stock:50, delivery:49, cod:true, sunlight:'High', water:'Medium', desc:'Sacred and medicinal plant.', care:'Water daily.', featured:true, active:true },
        { name:'Money Plant', sci:'Epipremnum aureum', emoji:'💚', cat:'Indoor Plants', price:129, mrp:179, stock:80, delivery:49, cod:true, sunlight:'Low', water:'Low', desc:'Brings prosperity and luck.', care:'Water weekly.', featured:true, active:true },
        { name:'Aloe Vera', emoji:'🌵', cat:'Indoor Plants', price:199, mrp:299, stock:40, delivery:49, cod:true, sunlight:'High', water:'Low', desc:'Medicinal plant.', care:'Water every 2-3 weeks.', featured:true, active:true },
      ]);
    }
    res.json({ success: true, message: 'All defaults seeded!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

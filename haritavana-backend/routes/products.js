const express = require('express');
const router = express.Router();
const { Product, Category } = require('../models');

// GET all active products (public)
router.get('/', async (req, res) => {
  try {
    const { cat, featured, active } = req.query;
    let filter = {};
    if (cat) filter.cat = cat;
    if (featured === 'true') filter.featured = true;
    if (active !== 'false') filter.active = true;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all products including hidden (admin)
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create product (admin)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product, message: 'Product created!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update product (admin)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product, message: 'Product updated!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH toggle active
router.patch('/:id/toggle', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    product.active = !product.active;
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE product (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST seed default products
router.post('/seed/defaults', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) return res.json({ success: true, message: 'Products already exist' });
    const defaults = [
      { name:'Tulsi (Holy Basil)', sci:'Ocimum tenuiflorum', emoji:'🌿', cat:'Indoor Plants', price:149, mrp:199, stock:50, delivery:49, cod:true, sunlight:'High', water:'Medium', desc:'Sacred and medicinal, Tulsi is a must-have in every Indian home.', care:'Water daily. 4-6 hours sunlight.', featured:true, active:true },
      { name:'Money Plant', sci:'Epipremnum aureum', emoji:'💚', cat:'Indoor Plants', price:129, mrp:179, stock:80, delivery:49, cod:true, sunlight:'Low', water:'Low', desc:'Brings prosperity and good luck. Perfect for beginners.', care:'Water once a week.', featured:true, active:true },
      { name:'Aloe Vera', sci:'Aloe barbadensis', emoji:'🌵', cat:'Indoor Plants', price:199, mrp:299, stock:40, delivery:49, cod:true, sunlight:'High', water:'Low', desc:'The ultimate medicinal plant.', care:'Water every 2-3 weeks.', featured:true, active:true },
      { name:'Mogra (Arabian Jasmine)', sci:'Jasminum sambac', emoji:'🌸', cat:'Flowering Plants', price:279, mrp:399, stock:30, delivery:59, cod:true, sunlight:'High', water:'Medium', desc:'Divine fragrance! Beloved across India.', care:'Full sun. Water regularly.', featured:true, active:true },
      { name:'Curry Leaf Plant', sci:'Murraya koenigii', emoji:'🍃', cat:'Outdoor Plants', price:229, mrp:329, stock:35, delivery:59, cod:true, sunlight:'High', water:'Medium', desc:'Fresh curry leaves for cooking.', care:'Full sun. Water regularly.', featured:true, active:true },
    ];
    await Product.insertMany(defaults);
    res.json({ success: true, message: 'Default products seeded!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

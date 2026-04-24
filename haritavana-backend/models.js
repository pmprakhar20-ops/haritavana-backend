const mongoose = require('mongoose');

// ── PRODUCT MODEL ──
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  sci:         { type: String, default: '' },
  emoji:       { type: String, default: '🌿' },
  images:      [{ type: String }],
  cat:         { type: String, required: true },
  price:       { type: Number, required: true },
  mrp:         { type: Number, default: 0 },
  stock:       { type: Number, default: 0 },
  delivery:    { type: Number, default: 49 },
  cod:         { type: Boolean, default: true },
  sunlight:    { type: String, default: 'Medium' },
  water:       { type: String, default: 'Medium' },
  desc:        { type: String, default: '' },
  care:        { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

// ── ORDER MODEL ──
const orderSchema = new mongoose.Schema({
  orderId:         { type: String, required: true, unique: true },
  customerName:    { type: String, required: true },
  customerPhone:   { type: String, required: true },
  customerEmail:   { type: String, default: '' },
  address:         { type: String, required: true },
  city:            { type: String, required: true },
  pin:             { type: String, required: true },
  items:           [{ 
    id:      String,
    name:    String,
    price:   Number,
    qty:     Number,
    delivery: Number,
    emoji:   String,
    images:  [String]
  }],
  total:           { type: Number, required: true },
  payment:         { type: String, enum: ['upi', 'cod'], default: 'cod' },
  txnId:           { type: String, default: 'COD' },
  notes:           { type: String, default: '' },
  status:          { type: String, enum: ['Pending','Confirmed','Shipped','Delivered','Cancelled'], default: 'Pending' },
}, { timestamps: true });

// ── CATEGORY MODEL ──
const categorySchema = new mongoose.Schema({
  name:   { type: String, required: true },
  icon:   { type: String, default: '🌿' },
}, { timestamps: true });

// ── CUSTOMER MODEL ──
const customerSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  phone:       { type: String, required: true, unique: true },
  email:       { type: String, default: '' },
  password:    { type: String, default: '' },
  city:        { type: String, default: '' },
  orders:      { type: Number, default: 0 },
  totalSpent:  { type: Number, default: 0 },
}, { timestamps: true });

// ── DELIVERY AREA MODEL ──
const deliverySchema = new mongoose.Schema({
  name:      { type: String, required: true },
  district:  { type: String, required: true },
  state:     { type: String, default: 'U.P.' },
  active:    { type: Boolean, default: true },
}, { timestamps: true });

// ── SETTINGS MODEL ──
const settingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = {
  Product:      mongoose.model('Product', productSchema),
  Order:        mongoose.model('Order', orderSchema),
  Category:     mongoose.model('Category', categorySchema),
  Customer:     mongoose.model('Customer', customerSchema),
  DeliveryArea: mongoose.model('DeliveryArea', deliverySchema),
  Settings:     mongoose.model('Settings', settingsSchema),
};

# HaritaVana Backend — Deployment Guide

## Files in this folder:
- server.js — Main server
- models.js — Database schemas
- routes/ — All API endpoints
- package.json — Dependencies

---

## STEP 1 — Upload to GitHub

1. Go to github.com → Click "+" → "New repository"
2. Name it: haritavana-backend
3. Keep it Public
4. Click "Create repository"
5. On next page, click "uploading an existing file"
6. Upload ALL files from this folder (including routes folder)
7. Click "Commit changes"

---

## STEP 2 — Deploy on Render

1. Go to render.com → Click "New +"
2. Select "Web Service"
3. Connect your GitHub account
4. Select "haritavana-backend" repository
5. Fill in:
   - Name: haritavana-backend
   - Region: Singapore (closest to India)
   - Branch: main
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node server.js
6. Click "Advanced" → "Add Environment Variable"
7. Add:
   - Key: MONGODB_URI
   - Value: mongodb+srv://pmprakhar20_db_user:ramramji@cluster0.ixeko44.mongodb.net/haritavana
8. Click "Create Web Service"
9. Wait 3-5 minutes for deployment
10. Copy your Render URL (looks like: https://haritavana-backend.onrender.com)

---

## STEP 3 — Update Frontend

After getting Render URL, tell Claude and he will update
your frontend files to use the real backend API.

---

## API Endpoints Reference:

GET    /api/products          — All active products
GET    /api/products/all      — All products (admin)
POST   /api/products          — Add product
PUT    /api/products/:id      — Update product
DELETE /api/products/:id      — Delete product

GET    /api/orders            — All orders (admin)
POST   /api/orders            — Place order
PATCH  /api/orders/:id/status — Update order status

GET    /api/categories        — All categories
POST   /api/categories        — Add category

GET    /api/customers         — All customers
POST   /api/customers/login   — Customer login
POST   /api/customers/register — Register

GET    /api/delivery          — Delivery areas
POST   /api/delivery          — Add area

POST   /api/admin/login       — Admin login
GET    /api/admin/stats       — Dashboard stats
POST   /api/admin/seed        — Seed default data

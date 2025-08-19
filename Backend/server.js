import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: './salon.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, phone TEXT, service TEXT, date TEXT, time TEXT, notes TEXT
    );
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, price TEXT
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, price TEXT
    );
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, message TEXT
    );
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, email TEXT, message TEXT
    );
  `);
})();

// === BOOKINGS ===
app.post('/api/bookings', async (req, res) => {
  const { name, phone, service, date, time, notes } = req.body;
  if (!name || !phone || !service || !date || !time) return res.status(400).json({ message: 'Missing fields' });
  await db.run('INSERT INTO bookings (name, phone, service, date, time, notes) VALUES (?, ?, ?, ?, ?, ?)', [name, phone, service, date, time, notes]);
  res.json({ message: 'Booking confirmed' });
});

app.get('/api/bookings', async (req, res) => {
  const bookings = await db.all('SELECT * FROM bookings');
  res.json(bookings);
});

// === SERVICES ===
app.get('/api/services', async (req, res) => {
  const services = await db.all('SELECT * FROM services');
  res.json(services);
});

app.post('/api/services', async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Missing fields' });
  await db.run('INSERT INTO services (name, price) VALUES (?, ?)', [name, price]);
  res.json({ message: 'Service added' });
});

app.delete('/api/services/:id', async (req, res) => {
  await db.run('DELETE FROM services WHERE id = ?', [req.params.id]);
  res.json({ message: 'Service deleted' });
});

// === PRODUCTS ===
app.get('/api/products', async (req, res) => {
  const products = await db.all('SELECT * FROM products');
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Missing fields' });
  await db.run('INSERT INTO products (name, price) VALUES (?, ?)', [name, price]);
  res.json({ message: 'Product added' });
});

app.delete('/api/products/:id', async (req, res) => {
  await db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ message: 'Product deleted' });
});

// === COMMENTS ===
app.post('/api/comments', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).json({ message: 'Missing fields' });
  await db.run('INSERT INTO comments (name, message) VALUES (?, ?)', [name, message]);
  res.json({ message: 'Comment submitted' });
});

// === CONTACTS ===
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' });
  await db.run('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
  res.json({ message: 'Message received' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


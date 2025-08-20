const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Failed to connect to database:', err);
    } else {
        console.log('Connected to SQLite database.');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    service TEXT,
    date TEXT,
    time TEXT,
    notes TEXT
)`);

app.post('/api/bookings', (req, res) => {
    const { name, phone, service, date, time, notes } = req.body;

    if (!name || !phone || !service || !date || !time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare(`INSERT INTO bookings (name, phone, service, date, time, notes) VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(name, phone, service, date, time, notes, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to save booking' });
        } else {
            res.status(200).json({ message: 'Booking saved successfully', id: this.lastID });
        }
    });
});

app.get('/', (req, res) => {
    res.send('Salon booking backend is live!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
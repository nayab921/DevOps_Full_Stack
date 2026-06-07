const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection aur table creation
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Database error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Users Table for Login/Signup
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )`);

        // Items Table for CRUD operations
        db.run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            quantity INTEGER,
            description TEXT
        )`);
    }
});

// --- API ROUTES ---

// 1. Signup Route
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, password], function(err) {
        if (err) return res.status(400).json({ error: "Email already exists!" });
        res.json({ message: "Registration successful!" });
    });
});

// 2. Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
        if (user) {
            res.json({ message: "Login successful!", user });
        } else {
            res.status(401).json({ error: "Invalid email or password!" });
        }
    });
});

// 3. Get All Items (View Data)
app.get('/items', (req, res) => {
    db.all(`SELECT * FROM items`, [], (err, rows) => {
        res.json(rows);
    });
});

// 4. Add New Item (Create)
app.post('/items', (req, res) => {
    const { name, quantity, description } = req.body;
    db.run(`INSERT INTO items (name, quantity, description) VALUES (?, ?, ?)`, [name, quantity, description], function(err) {
        res.json({ id: this.lastID, name, quantity, description });
    });
});

// 5. Update Item (Edit)
app.put('/items/:id', (req, res) => {
    const { name, quantity, description } = req.body;
    db.run(`UPDATE items SET name = ?, quantity = ?, description = ? WHERE id = ?`, [name, quantity, description, req.params.id], function(err) {
        res.json({ message: "Item updated successfully!" });
    });
});

// 6. Delete Item (Delete)
app.delete('/items/:id', (req, res) => {
    db.run(`DELETE FROM items WHERE id = ?`, [req.params.id], function(err) {
        res.json({ message: "Item deleted successfully!" });
    });
});

// Server Start Karna
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'shop.db'));

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            article TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0,
            photo TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            discount INTEGER NOT NULL DEFAULT 0,
            total REAL NOT NULL,
            seller TEXT NOT NULL,
            shift_id INTEGER,
            date TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS shifts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            seller TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT,
            total REAL DEFAULT 0,
            status TEXT DEFAULT 'open'
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )
    `);

    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO products (article, name, price, stock) VALUES (?, ?, ?, ?)`,
                ['A001', 'Тестовый товар', 100, 10]);
        }
    });
});

module.exports = db;
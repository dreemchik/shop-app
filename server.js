const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./database');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const users = [
    { username: 'admin', password: '123', role: 'admin' },
    { username: 'seller', password: '123', role: 'employee' }
];

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, role: user.role, username: user.username });
    } else {
        res.json({ success: false });
    }
});

// === ТОВАРЫ ===
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products ORDER BY id DESC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/products', upload.single('photo'), (req, res) => {
    const { article, name, description, price, stock } = req.body;
    const photo = req.file ? '/uploads/' + req.file.filename : null;

    db.run(
        'INSERT INTO products (article, name, description, price, stock, photo) VALUES (?, ?, ?, ?, ?, ?)',
        [article, name, description || '', price, stock, photo],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

app.put('/api/products/:id', upload.single('photo'), (req, res) => {
    const { article, name, description, price, stock } = req.body;

    db.get('SELECT photo FROM products WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        const photo = req.file ? '/uploads/' + req.file.filename : row.photo;

        db.run(
            'UPDATE products SET article = ?, name = ?, description = ?, price = ?, stock = ?, photo = ? WHERE id = ?',
            [article, name, description || '', price, stock, photo, req.params.id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true });
            }
        );
    });
});

app.delete('/api/products/:id', (req, res) => {
    db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// === СМЕНЫ ===
app.post('/api/shifts/start', (req, res) => {
    const { seller } = req.body;
    const startTime = new Date().toISOString();

    db.get(`SELECT * FROM shifts WHERE seller = ? AND status = 'open'`, [seller], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.json({ success: false, error: 'Смена уже открыта', shift: row });

        db.run(`INSERT INTO shifts (seller, start_time) VALUES (?, ?)`, [seller, startTime], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, shift_id: this.lastID });
        });
    });
});

app.get('/api/shifts/current/:seller', (req, res) => {
    db.get(`SELECT * FROM shifts WHERE seller = ? AND status = 'open' ORDER BY id DESC LIMIT 1`,
        [req.params.seller], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row || null);
        });
});

app.post('/api/shifts/close', (req, res) => {
    const { shift_id } = req.body;
    const endTime = new Date().toISOString();

    db.get(`SELECT * FROM shifts WHERE id = ?`, [shift_id], (err, shift) => {
        if (err || !shift) return res.status(404).json({ error: 'Смена не найдена' });

        db.get(`SELECT COALESCE(SUM(total), 0) as total FROM sales WHERE shift_id = ?`, [shift_id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            const total = row.total;

            db.run(`UPDATE shifts SET end_time = ?, total = ?, status = 'closed' WHERE id = ?`,
                [endTime, total, shift_id], function (err) {
                    if (err) return res.status(500).json({ error: err.message });

                    const message = `Сотрудник ${shift.seller} закрыл смену. Выручка: ${total.toFixed(2)} ₽`;
                    db.run(`INSERT INTO notifications (message, created_at) VALUES (?, ?)`,
                        [message, endTime]);

                    res.json({ success: true, total });
                });
        });
    });
});

app.get('/api/shifts/closed', (req, res) => {
    db.all(`SELECT * FROM shifts WHERE status = 'closed' ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// === ПРОДАЖИ ===
app.post('/api/sales', (req, res) => {
    const { product_id, quantity, discount, seller, shift_id } = req.body;
    const date = new Date().toISOString().split('T')[0];

    db.get(`SELECT * FROM shifts WHERE id = ? AND status = 'open'`, [shift_id], (err, shift) => {
        if (err || !shift) return res.status(400).json({ error: 'Смена не открыта' });

        db.get('SELECT price, stock FROM products WHERE id = ?', [product_id], (err, product) => {
            if (err || !product) return res.status(500).json({ error: 'Товар не найден' });
            if (product.stock < quantity) return res.status(400).json({ error: 'Недостаточно товара' });

            const priceWithDiscount = product.price * (1 - discount / 100);
            const total = priceWithDiscount * quantity;

            db.run(
                'INSERT INTO sales (product_id, quantity, discount, total, seller, shift_id, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [product_id, quantity, discount, total, seller, shift_id, date],
                function (err) {
                    if (err) return res.status(500).json({ error: err.message });
                    db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id]);
                    res.json({ success: true, total });
                }
            );
        });
    });
});

app.get('/api/sales/today', (req, res) => {
    const date = new Date().toISOString().split('T')[0];
    db.all(`
        SELECT sales.*, products.article, products.name
        FROM sales JOIN products ON sales.product_id = products.id
        WHERE sales.date = ? ORDER BY sales.id DESC
    `, [date], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/sales/shift/:shift_id', (req, res) => {
    db.all(`
        SELECT sales.*, products.article, products.name
        FROM sales JOIN products ON sales.product_id = products.id
        WHERE sales.shift_id = ? ORDER BY sales.id DESC
    `, [req.params.shift_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/sales/:id', (req, res) => {
    const saleId = req.params.id;

    db.get('SELECT * FROM sales WHERE id = ?', [saleId], (err, sale) => {
        if (err || !sale) return res.status(404).json({ error: 'Продажа не найдена' });

        db.get(`SELECT * FROM shifts WHERE id = ? AND status = 'open'`, [sale.shift_id], (err, shift) => {
            if (err || !shift) return res.status(400).json({ error: 'Смена закрыта, отмена невозможна' });

            db.run('UPDATE products SET stock = stock + ? WHERE id = ?', [sale.quantity, sale.product_id], (err) => {
                if (err) return res.status(500).json({ error: err.message });

                db.run('DELETE FROM sales WHERE id = ?', [saleId], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ success: true });
                });
            });
        });
    });
});

// === УВЕДОМЛЕНИЯ ===
app.get('/api/notifications', (req, res) => {
    db.all(`SELECT * FROM notifications ORDER BY id DESC LIMIT 50`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/notifications/unread-count', (req, res) => {
    db.get(`SELECT COUNT(*) as count FROM notifications WHERE is_read = 0`, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ count: row.count });
    });
});

app.post('/api/notifications/read-all', (req, res) => {
    db.run(`UPDATE notifications SET is_read = 1 WHERE is_read = 0`, [], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
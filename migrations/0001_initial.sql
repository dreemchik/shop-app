-- 0001_initial.sql — начальная схема базы (восстановлена из экспорта production D1)

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    tc TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'employee'
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tcs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER,
    photo TEXT
);

CREATE TABLE IF NOT EXISTS product_stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    tc_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    period_quantity INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    discount INTEGER NOT NULL DEFAULT 0,
    discount_reason TEXT DEFAULT '',
    payment_method TEXT DEFAULT 'cash',
    custom_price REAL,
    total REAL NOT NULL,
    seller_id INTEGER NOT NULL,
    shift_id INTEGER,
    date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    total REAL DEFAULT 0,
    status TEXT DEFAULT 'open'
);

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    assigned_to INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    photos TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    admin_comment TEXT DEFAULT '',
    created_at TEXT NOT NULL
);

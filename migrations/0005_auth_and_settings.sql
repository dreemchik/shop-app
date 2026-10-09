-- 0005_auth_and_settings.sql — хеширование паролей и минимальный остаток товаров
ALTER TABLE users ADD COLUMN password_salt TEXT;
ALTER TABLE products ADD COLUMN min_stock INTEGER DEFAULT 3;
-- 0003_finance.sql — учёт доходов и расходов (двусторонняя таблица)
-- Доходы автоматически создаются при закрытии смены (source='auto_shift').
-- Расходы и прочие ручные корректировки вводит Эльвира (source='manual').

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,                                  -- YYYY-MM-DD
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount REAL NOT NULL,
    description TEXT DEFAULT '',
    source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'auto_shift')),
    shift_id INTEGER,                                    -- ссылка на смену для авто-доходов
    created_by INTEGER,                                  -- кто добавил (пользователь)
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

-- Одна авто-запись на одну смену (ручные записи имеют shift_id = NULL и не ограничены)
CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_shift
    ON transactions(shift_id) WHERE shift_id IS NOT NULL;

-- Переносим уже закрытые смены в таблицу финансов как авто-доходы.
-- Описание формируется автоматически: "Смена <Имя>, <ТЦ>".
INSERT OR IGNORE INTO transactions
    (date, type, amount, description, source, shift_id, created_by, created_at)
SELECT
    substr(s.start_time, 1, 10),
    'income',
    COALESCE(s.total, 0),
    'Смена ' || u.full_name ||
        CASE WHEN COALESCE(u.tc, '') <> '' THEN ', ' || u.tc ELSE '' END,
    'auto_shift',
    s.id,
    s.seller_id,
    COALESCE(s.end_time, s.start_time)
FROM shifts s
JOIN users u ON s.seller_id = u.id
WHERE s.status = 'closed';

-- 0002_shift_notes.sql — заметки и фото тетради по смене

ALTER TABLE shifts ADD COLUMN notes TEXT DEFAULT '';
ALTER TABLE shifts ADD COLUMN photos TEXT DEFAULT '';

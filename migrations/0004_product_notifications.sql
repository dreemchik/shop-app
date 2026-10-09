-- 0004_product_notifications.sql — адресные уведомления для продавцов
-- target_user_id: NULL = общее уведомление (видят все), число = только для указанного пользователя

ALTER TABLE notifications ADD COLUMN target_user_id INTEGER;
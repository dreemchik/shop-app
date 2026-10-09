PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(1,'0001_initial.sql','2026-09-13 16:57:49');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(2,'0002_shift_notes.sql','2026-09-22 12:33:10');
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    tc TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'employee'
);
INSERT INTO "users" ("id","username","password","full_name","tc","role") VALUES(1,'admin','123','Директор','','admin');
INSERT INTO "users" ("id","username","password","full_name","tc","role") VALUES(2,'arina','123','Арина','ТЦ Центральный','employee');
INSERT INTO "users" ("id","username","password","full_name","tc","role") VALUES(3,'elvira','123','Эльвира','ТЦ Мир','employee');
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);
INSERT INTO "categories" ("id","name") VALUES(1,'Комплекты Body-пояса');
INSERT INTO "categories" ("id","name") VALUES(2,'Пижамы');
INSERT INTO "categories" ("id","name") VALUES(3,'Сорочки');
INSERT INTO "categories" ("id","name") VALUES(4,'Халаты');
INSERT INTO "categories" ("id","name") VALUES(5,'Трусы');
INSERT INTO "categories" ("id","name") VALUES(6,'Купальники');
INSERT INTO "categories" ("id","name") VALUES(7,'Туники');
INSERT INTO "categories" ("id","name") VALUES(9,'Сумки');
INSERT INTO "categories" ("id","name") VALUES(10,'Колготки');
INSERT INTO "categories" ("id","name") VALUES(11,'Чулки');
CREATE TABLE tcs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);
INSERT INTO "tcs" ("id","name") VALUES(1,'ТЦ Центральный');
INSERT INTO "tcs" ("id","name") VALUES(3,'Тц ультра ');
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER,
    photo TEXT
);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(1,'K001','Комплект Body-пояс хлопок','Хлопковый комплект с корректирующим поясом, размеры S-XL',2500,0,1,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(2,'K002','Комплект Body-пояс кружево','Комплект с кружевной отделкой, размеры M-L',2800,0,1,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(3,'P001','Пижама муслим хлопок','Мягкая пижама из муслина, футболка + шорты',1990,0,2,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(4,'P002','Пижама белая с цветочком','Пижама с цветочным принтом, майка + шорты',1590,0,2,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(5,'S001','Сорочка ночная хлопок','Классическая ночная сорочка из хлопка',1200,0,3,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(6,'S002','Сорочка атласная','Атласная сорочка с кружевом',1690,0,3,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(7,'H001','Халат махровый','Махровый халат с поясом, унисекс',2200,0,4,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(8,'H002','Халат велюровый','Велюровый халат с капюшоном',2400,0,4,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(9,'T001','Трусы хлопок (3 шт.)','Комплект из 3 хлопковых трусов',590,0,5,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(10,'KUP001','Купальник чёрный','Чёрный слитный купальник',1500,0,6,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(11,'KUP002','Купальник раздельный','Раздельный купальник с принтом',1700,0,NULL,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(12,'TU001','Туника пляжная','Лёгкая пляжная туника',1100,0,7,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(13,'TA001','Тапочки домашние','Мягкие домашние тапочки',450,0,8,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(14,'SUM001','Сумка пляжная','Пляжная сумка с принтом',890,0,9,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(15,'KOL001','Колготки 40 den','Колготки классические 40 den',350,0,10,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(16,'KOL002','Колготки с шортом','Колготки с эффектом шортиков',490,0,10,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(17,'CH001','Чулки кружевные','Чулки с кружевной резинкой',590,0,11,NULL);
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(18,'N001','Носки хлопок (5 пар)','Комплект из 5 пар хлопковых носков',390,0,12,'/uploads/1789384965703-571567072.jpeg');
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(19,'1','Комплект','Комплект белый уфа',2300,0,NULL,'/uploads/1789339580951-240159697.jpg');
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(20,'1','Комплект уфа','Уфа комплект белый',3800,0,NULL,'/uploads/1789386539959-43097387.png');
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(21,'123','Комплект','Комплект красный уфа',2300,0,NULL,'/uploads/1791193641653-416374815.jpg');
INSERT INTO "products" ("id","article","name","description","price","stock","category_id","photo") VALUES(22,'1234','Комплект уфа','Комплект красный',2400,0,1,'/uploads/1791193864380-854378823.jpg');
CREATE TABLE product_stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    tc_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    period_quantity INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(1,10,1,15,0);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(2,10,2,20,0);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(3,19,2,'',0);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(4,19,1,1,0);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(5,20,2,0,0);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(6,20,1,0,0);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(7,18,2,0,0);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(8,18,1,0,0);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(9,11,2,0,0);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(10,11,1,3,0);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(11,21,1,10,5);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(12,21,3,12,0);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(13,22,1,10,12);
INSERT INTO "product_stock" ("id","product_id","tc_id","quantity","period_quantity") VALUES(14,22,3,5,4);
CREATE TABLE sales (
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
INSERT INTO "sales" ("id","product_id","quantity","discount","discount_reason","payment_method","custom_price","total","seller_id","shift_id","date") VALUES(1,10,1,0,'','cash',1500,1500,2,2,'2026-09-13');
INSERT INTO "sales" ("id","product_id","quantity","discount","discount_reason","payment_method","custom_price","total","seller_id","shift_id","date") VALUES(3,10,1,0,'','cash',1500,1500,2,2,'2026-09-13');
INSERT INTO "sales" ("id","product_id","quantity","discount","discount_reason","payment_method","custom_price","total","seller_id","shift_id","date") VALUES(4,10,1,0,'','card',1500,1500,2,7,'2026-09-23');
INSERT INTO "sales" ("id","product_id","quantity","discount","discount_reason","payment_method","custom_price","total","seller_id","shift_id","date") VALUES(5,10,1,10,'Пром','card',1500,1350,2,8,'2026-10-05');
INSERT INTO "sales" ("id","product_id","quantity","discount","discount_reason","payment_method","custom_price","total","seller_id","shift_id","date") VALUES(6,10,2,0,'','cash',1500,3000,2,8,'2026-10-05');
CREATE TABLE shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    total REAL DEFAULT 0,
    status TEXT DEFAULT 'open'
, notes TEXT DEFAULT '', photos TEXT DEFAULT '');
INSERT INTO "shifts" ("id","seller_id","start_time","end_time","total","status","notes","photos") VALUES(1,2,'2026-09-13T22:36:07.626Z','2026-09-13T22:40:28.906Z',0,'closed','','');
INSERT INTO "shifts" ("id","seller_id","start_time","end_time","total","status","notes","photos") VALUES(2,2,'2026-09-13T23:02:57.269Z','2026-09-13T23:05:32.275Z',3000,'closed','','');
INSERT INTO "shifts" ("id","seller_id","start_time","end_time","total","status","notes","photos") VALUES(3,1,'2026-09-14T11:50:22.546Z','2026-09-14T19:37:55.585Z',0,'closed','','');
INSERT INTO "shifts" ("id","seller_id","start_time","end_time","total","status","notes","photos") VALUES(4,2,'2026-09-15T01:28:42.887Z','2026-09-15T01:28:48.746Z',0,'closed','','');
INSERT INTO "shifts" ("id","seller_id","start_time","end_time","total","status","notes","photos") VALUES(5,2,'2026-09-16T05:56:15.479Z','2026-09-16T21:13:48.346Z',0,'closed','','');
INSERT INTO "shifts" ("id","seller_id","start_time","end_time","total","status","notes","photos") VALUES(6,1,'2026-09-17T15:14:38.178Z',NULL,0,'open','','');
INSERT INTO "shifts" ("id","seller_id","start_time","end_time","total","status","notes","photos") VALUES(7,2,'2026-09-22T13:06:57.314Z','2026-10-05T09:24:20.053Z',1500,'closed','','');
INSERT INTO "shifts" ("id","seller_id","start_time","end_time","total","status","notes","photos") VALUES(8,2,'2026-10-05T09:24:31.898Z',NULL,0,'open','','');
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
);
INSERT INTO "notifications" ("id","message","is_read","created_at") VALUES(1,'Арина закрыл(а) смену. Выручка: 0.00 ₽',1,'2026-09-13T22:40:28.906Z');
INSERT INTO "notifications" ("id","message","is_read","created_at") VALUES(2,'Арина закрыл(а) смену. Выручка: 3000.00 ₽',1,'2026-09-13T23:05:32.275Z');
INSERT INTO "notifications" ("id","message","is_read","created_at") VALUES(3,'Директор закрыл(а) смену. Выручка: 0.00 ₽',1,'2026-09-14T19:37:55.585Z');
INSERT INTO "notifications" ("id","message","is_read","created_at") VALUES(4,'Арина закрыл(а) смену. Выручка: 0.00 ₽',1,'2026-09-15T01:28:48.746Z');
INSERT INTO "notifications" ("id","message","is_read","created_at") VALUES(5,'Арина закрыл(а) смену. Выручка: 0.00 ₽',1,'2026-09-16T21:13:48.346Z');
INSERT INTO "notifications" ("id","message","is_read","created_at") VALUES(6,'Арина закрыл(а) смену. Выручка: 1500.00 ₽',1,'2026-10-05T09:24:20.053Z');
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    assigned_to INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TEXT NOT NULL
);
INSERT INTO "tasks" ("id","text","assigned_to","created_by","status","created_at") VALUES(1,'Всем хорошего дня ',1,1,'new','2026-09-13T22:58:44.590Z');
INSERT INTO "tasks" ("id","text","assigned_to","created_by","status","created_at") VALUES(2,'Работать',2,1,'done','2026-09-14T11:50:41.537Z');
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    photos TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    admin_comment TEXT DEFAULT '',
    created_at TEXT NOT NULL
);
INSERT INTO "documents" ("id","user_id","description","amount","photos","status","admin_comment","created_at") VALUES(1,2,'Букет',2500,'/uploads/1789340843875-604320297.jpg','approved','','2026-09-13T23:07:24.829Z');
INSERT INTO "documents" ("id","user_id","description","amount","photos","status","admin_comment","created_at") VALUES(2,2,'Букет',2500,'/uploads/1789340844531-577272210.jpg','approved','','2026-09-13T23:07:25.579Z');
INSERT INTO "documents" ("id","user_id","description","amount","photos","status","admin_comment","created_at") VALUES(3,2,'Вода',100,'/uploads/1791192958810-129902883.jpg','approved','','2026-10-05T09:35:58.865Z');
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('users',3);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('categories',12);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('tcs',3);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('products',22);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('product_stock',14);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('d1_migrations',2);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('shifts',8);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('notifications',6);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('tasks',2);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('sales',6);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('documents',3);

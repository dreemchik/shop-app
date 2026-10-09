# show-app — Магазин (панель администратора + касса)

Вёрстка и бэкенд полностью восстановлены **08.10.2026** прямиком с production
(Cloudflare Worker `show-app`), после потери локальных исходников.

## Стек

- **Cloudflare Worker** — API и раздача страниц (`src/index.js`)
- **D1** (`show-app-db`) — база данных (SQLite)
- **KV** (`SHOW_IMAGES`) — загруженные фото (товары, документы, тетради смен)
- **Static Assets** (`public/`) — login.html, admin.html, employee.html

## Возможности

- Товары, категории, торговые центры, остатки по ТЦ
- Рабочий день: открытие/закрытие смены, продажи (наличка/карта/сертификат), скидки с причиной
- Дневные продажи, выручка и отчёты за период (7/30 дней, фильтр по сотруднику)
- Задачи, документы сотрудников (аванс/прочее с фото), уведомления
- Заметки по смене + фото тетради
- Сотрудники и роли (admin / employee), тёмная тема

## Структура

```
src/index.js          — код воркера (API + маршруты)
public/               — статические страницы (ассеты)
migrations/           — миграции D1 (0001_initial, 0002_shift_notes)
backup/d1-backup.sql  — полный экспорт production-базы (08.10.2026)
backup/kv-uploads/    — все фото из KV (10 файлов)
wrangler.jsonc        — конфиг воркера (биндинги D1/KV/ASSETS)
```

## Команды

```bash
npm install            # ставит wrangler
npm run dev            # локальный dev-сервер (wrangler dev)
npm run deploy         # деплой на Cloudflare
npm run db:export      # экспорт production-базы в backup/d1-backup.sql
npm run db:local       # залить backup в локальную базу для разработки
```

## Данные

- Production база: D1 `show-app-db` (id `172c2b0d-9244-41c3-adcb-dc4ab4a819d6`)
- KV: namespace `b582f717ebc04d0491381a6226215e97`
- Роутинг воркера: `/api/*` → API, `/uploads/*` → фото из KV,
  `/` → login.html, всё остальное → статика

## Известные проблемы

- `manifest.json` был подключён в HTML, но отсутствовал (404) — добавлен в `public/`
- Логины по умолчанию: `admin/123`, продавцы `arina/123`, `elvira/123` (пароли открыты — стоит переделать на нормальную авторизацию)

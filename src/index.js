var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/src/index.js
var json = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8" }
}), "json");
var fail = /* @__PURE__ */ __name((msg, status = 500) => json({ error: msg }, status), "fail");
var nowISO = /* @__PURE__ */ __name(() => (/* @__PURE__ */ new Date()).toISOString(), "nowISO");
var reqJson = /* @__PURE__ */ __name((request) => request.json().catch(() => ({})), "reqJson");
var today = /* @__PURE__ */ __name(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0], "today");
function match(pattern, pathname) {
  const pp = pattern.split("/").filter(Boolean);
  const sp = pathname.split("/").filter(Boolean);
  if (pp.length !== sp.length)
    return null;
  const params = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(":"))
      params[pp[i].slice(1)] = decodeURIComponent(sp[i]);
    else if (pp[i] !== sp[i])
      return null;
  }
  return params;
}
__name(match, "match");
async function all(env, sql, ...params) {
  const res = await env.DB.prepare(sql).bind(...params).all();
  return res.results;
}
__name(all, "all");
async function first(env, sql, ...params) {
  return await env.DB.prepare(sql).bind(...params).first() || null;
}
__name(first, "first");
async function run(env, sql, ...params) {
  return env.DB.prepare(sql).bind(...params).run();
}
__name(run, "run");
function extOf(name) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i) : "";
}
__name(extOf, "extOf");
function uniqName(original) {
  return Date.now() + "-" + Math.round(Math.random() * 1e9) + extOf(original || "");
}
__name(uniqName, "uniqName");
async function saveFile(env, file) {
  if (!file || !file.size)
    return null;
  const name = uniqName(file.name || "file");
  const buffer = await file.arrayBuffer();
  await env.SHOW_IMAGES.put(name, buffer, {
    metadata: { contentType: file.type || "application/octet-stream" }
  });
  return "/uploads/" + name;
}
__name(saveFile, "saveFile");
async function serveUpload(env, url) {
  const key = decodeURIComponent(url.pathname.slice("/uploads/".length));
  if (!key)
    return new Response("Not found", { status: 404 });
  const { value, metadata } = await env.SHOW_IMAGES.getWithMetadata(key, "arrayBuffer");
  if (value === null)
    return new Response("Not found", { status: 404 });
  const headers = new Headers();
  headers.set("Content-Type", metadata?.contentType || "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=86400");
  return new Response(value, { headers });
}
__name(serveUpload, "serveUpload");
async function login(env, request) {
  const { username, password } = await reqJson(request);
  const user = await first(env, "SELECT * FROM users WHERE username = ? AND password = ?", username, password);
  if (!user)
    return json({ success: false });
  return json({
    success: true,
    role: user.role,
    userId: user.id,
    username: user.username,
    fullName: user.full_name,
    tc: user.tc
  });
}
__name(login, "login");
async function listUsers(env) {
  const rows = await all(env, "SELECT id, username, full_name, tc, role FROM users ORDER BY id");
  return json(rows);
}
__name(listUsers, "listUsers");
async function createUser(env, request) {
  const { username, password, full_name, tc, role } = await reqJson(request);
  await run(
    env,
    "INSERT INTO users (username, password, full_name, tc, role) VALUES (?, ?, ?, ?, ?)",
    username,
    password,
    full_name,
    tc || "",
    role || "employee"
  );
  return json({ success: true });
}
__name(createUser, "createUser");
async function updateUser(env, request, params) {
  const { username, password, full_name, tc, role } = await reqJson(request);
  if (password) {
    await run(
      env,
      "UPDATE users SET username = ?, password = ?, full_name = ?, tc = ?, role = ? WHERE id = ?",
      username,
      password,
      full_name,
      tc || "",
      role,
      params.id
    );
  } else {
    await run(
      env,
      "UPDATE users SET username = ?, full_name = ?, tc = ?, role = ? WHERE id = ?",
      username,
      full_name,
      tc || "",
      role,
      params.id
    );
  }
  return json({ success: true });
}
__name(updateUser, "updateUser");
async function deleteUser(env, _request, params) {
  await run(env, "DELETE FROM users WHERE id = ?", params.id);
  return json({ success: true });
}
__name(deleteUser, "deleteUser");
async function listCategories(env) {
  return json(await all(env, "SELECT * FROM categories ORDER BY name"));
}
__name(listCategories, "listCategories");
async function createCategory(env, request) {
  const { name } = await reqJson(request);
  await run(env, "INSERT INTO categories (name) VALUES (?)", name);
  return json({ success: true });
}
__name(createCategory, "createCategory");
async function updateCategory(env, request, params) {
  const { name } = await reqJson(request);
  await run(env, "UPDATE categories SET name = ? WHERE id = ?", name, params.id);
  return json({ success: true });
}
__name(updateCategory, "updateCategory");
async function deleteCategory(env, _request, params) {
  await run(env, "DELETE FROM categories WHERE id = ?", params.id);
  return json({ success: true });
}
__name(deleteCategory, "deleteCategory");
async function listTcs(env) {
  return json(await all(env, "SELECT * FROM tcs ORDER BY name"));
}
__name(listTcs, "listTcs");
async function createTc(env, request) {
  const { name } = await reqJson(request);
  await run(env, "INSERT INTO tcs (name) VALUES (?)", name);
  return json({ success: true });
}
__name(createTc, "createTc");
async function updateTc(env, request, params) {
  const { name } = await reqJson(request);
  await run(env, "UPDATE tcs SET name = ? WHERE id = ?", name, params.id);
  return json({ success: true });
}
__name(updateTc, "updateTc");
async function deleteTc(env, _request, params) {
  await run(env, "DELETE FROM tcs WHERE id = ?", params.id);
  return json({ success: true });
}
__name(deleteTc, "deleteTc");
var PRODUCT_SELECT = `
    SELECT
        products.id, products.article, products.name, products.description,
        products.price, products.category_id, products.photo,
        categories.name as category_name,
        COALESCE((SELECT SUM(quantity) FROM product_stock WHERE product_id = products.id), 0) as stock
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id`;
async function listProducts(env) {
  return json(await all(env, PRODUCT_SELECT + " ORDER BY products.id DESC"));
}
__name(listProducts, "listProducts");
async function listProductsByCategory(env, _request, params) {
  const rows = await all(env, PRODUCT_SELECT + " WHERE products.category_id = ? ORDER BY products.id DESC", params.category_id);
  return json(rows);
}
__name(listProductsByCategory, "listProductsByCategory");
async function productStock(env, _request, params) {
  const rows = await all(env, `
        SELECT product_stock.*, tcs.name as tc_name
        FROM product_stock
        JOIN tcs ON product_stock.tc_id = tcs.id
        WHERE product_stock.product_id = ?`, params.id);
  return json(rows);
}
__name(productStock, "productStock");
async function parseProductForm(env, request) {
  const fd = await request.formData();
  const get = /* @__PURE__ */ __name((n) => (fd.get(n) || "").toString().trim(), "get");
  const photoFile = fd.get("photo");
  const photo = photoFile && photoFile.size ? await saveFile(env, photoFile) : null;
  return {
    article: get("article"),
    name: get("name"),
    description: get("description"),
    price: get("price"),
    category_id: get("category_id") || null,
    photo
  };
}
__name(parseProductForm, "parseProductForm");
async function createProduct(env, request) {
  const data = await parseProductForm(env, request);
  const res = await run(
    env,
    "INSERT INTO products (article, name, description, price, stock, category_id, photo) VALUES (?, ?, ?, ?, 0, ?, ?)",
    data.article,
    data.name,
    data.description,
    data.price,
    data.category_id,
    data.photo
  );
  // Уведомляем всех продавцов о новом товаре
  try {
    const employees = await all(env, "SELECT id FROM users WHERE role = 'employee'");
    const message = `\uD83C\uDD95 \u041D\u043E\u0432\u044B\u0439 \u0442\u043E\u0432\u0430\u0440: ${data.name} (\u0430\u0440\u0442\u0438\u043A\u0443\u043B ${data.article}), \u0446\u0435\u043D\u0430 ${data.price} \u20BD`;
    for (const emp of employees) {
      await run(
        env,
        "INSERT INTO notifications (message, created_at, target_user_id) VALUES (?, ?, ?)",
        message,
        nowISO(),
        emp.id
      );
    }
  } catch (e) {}
  return json({ success: true, id: Number(res.meta.last_row_id) });
}
__name(createProduct, "createProduct");
async function updateProduct(env, request, params) {
  const data = await parseProductForm(env, request);
  const existing = await first(env, "SELECT photo FROM products WHERE id = ?", params.id);
  const photo = data.photo || (existing ? existing.photo : null);
  await run(
    env,
    "UPDATE products SET article = ?, name = ?, description = ?, price = ?, category_id = ?, photo = ? WHERE id = ?",
    data.article,
    data.name,
    data.description,
    data.price,
    data.category_id,
    photo,
    params.id
  );
  return json({ success: true });
}
__name(updateProduct, "updateProduct");
async function deleteProduct(env, _request, params) {
  await run(env, "DELETE FROM products WHERE id = ?", params.id);
  return json({ success: true });
}
__name(deleteProduct, "deleteProduct");
async function upsertProductStock(env, request) {
  const { product_id, tc_id, quantity, period_quantity } = await reqJson(request);
  const row = await first(env, "SELECT id FROM product_stock WHERE product_id = ? AND tc_id = ?", product_id, tc_id);
  if (row) {
    await run(
      env,
      "UPDATE product_stock SET quantity = ?, period_quantity = ? WHERE id = ?",
      quantity,
      period_quantity || 0,
      row.id
    );
  } else {
    await run(
      env,
      "INSERT INTO product_stock (product_id, tc_id, quantity, period_quantity) VALUES (?, ?, ?, ?)",
      product_id,
      tc_id,
      quantity,
      period_quantity || 0
    );
  }
  return json({ success: true });
}
__name(upsertProductStock, "upsertProductStock");
async function startShift(env, request) {
  const { seller_id } = await reqJson(request);
  const open = await first(env, "SELECT * FROM shifts WHERE seller_id = ? AND status = 'open'", seller_id);
  if (open)
    return json({ success: false, error: "\u0421\u043C\u0435\u043D\u0430 \u0443\u0436\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u0430", shift: open });
  const res = await run(env, "INSERT INTO shifts (seller_id, start_time) VALUES (?, ?)", seller_id, nowISO());
  return json({ success: true, shift_id: Number(res.meta.last_row_id) });
}
__name(startShift, "startShift");
async function currentShift(env, _request, params) {
  const row = await first(
    env,
    "SELECT * FROM shifts WHERE seller_id = ? AND status = 'open' ORDER BY id DESC LIMIT 1",
    params.seller_id
  );
  return json(row || null);
}
__name(currentShift, "currentShift");
async function closeShift(env, request) {
  const { shift_id } = await reqJson(request);
  const shift = await first(env, `
        SELECT shifts.*, users.full_name, users.tc FROM shifts
        JOIN users ON shifts.seller_id = users.id
        WHERE shifts.id = ?`, shift_id);
  if (!shift)
    return json({ error: "\u0421\u043C\u0435\u043D\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" }, 404);
  const totalRow = await first(env, "SELECT COALESCE(SUM(total), 0) as total FROM sales WHERE shift_id = ?", shift_id);
  const total = Number(totalRow.total);
  const endTime = nowISO();
  await run(
    env,
    "UPDATE shifts SET end_time = ?, total = ?, status = 'closed' WHERE id = ?",
    endTime,
    total,
    shift_id
  );
  await run(
    env,
    "INSERT INTO notifications (message, created_at) VALUES (?, ?)",
    `${shift.full_name} \u0437\u0430\u043A\u0440\u044B\u043B(\u0430) \u0441\u043C\u0435\u043D\u0443. \u0412\u044B\u0440\u0443\u0447\u043A\u0430: ${total.toFixed(2)} \u20BD`,
    endTime
  );
  const shiftDate = (shift.start_time || endTime).slice(0, 10);
  const shiftTc = shift.tc ? `, ${shift.tc}` : "";
  await run(
    env,
    `INSERT OR IGNORE INTO transactions (date, type, amount, description, source, shift_id, created_by, created_at)
         VALUES (?, 'income', ?, ?, 'auto_shift', ?, ?, ?)`,
    shiftDate,
    total,
    `\u0421\u043C\u0435\u043D\u0430 ${shift.full_name}${shiftTc}`,
    shift_id,
    shift.seller_id,
    endTime
  );
  return json({ success: true, total });
}
__name(closeShift, "closeShift");
async function closedShifts(env) {
  const rows = await all(env, `
        SELECT shifts.*, users.full_name FROM shifts
        JOIN users ON shifts.seller_id = users.id
        WHERE shifts.status = 'closed' ORDER BY shifts.id DESC`);
  return json(rows);
}
__name(closedShifts, "closedShifts");
async function myShifts(env, _request, params) {
  const rows = await all(
    env,
    "SELECT * FROM shifts WHERE seller_id = ? AND status = 'closed' ORDER BY id DESC",
    params.seller_id
  );
  return json(rows);
}
__name(myShifts, "myShifts");
async function parseShiftForm(env, request) {
  const fd = await request.formData();
  const get = /* @__PURE__ */ __name((n) => (fd.get(n) || "").toString().trim(), "get");
  const seller_id = get("seller_id");
  const notes = get("notes");
  const files = fd.getAll("photos").filter((f) => f && f.size);
  const paths = [];
  for (const f of files) {
    const p = await saveFile(env, f);
    if (p)
      paths.push(p);
  }
  return { seller_id, notes, photos: paths.join(",") };
}
__name(parseShiftForm, "parseShiftForm");
async function createShiftWithNotes(env, request) {
  const { seller_id, notes, photos } = await parseShiftForm(env, request);
  const open = await first(env, "SELECT id FROM shifts WHERE seller_id = ? AND status = 'open'", seller_id);
  if (open)
    return json({ success: false, error: "\u0421\u043C\u0435\u043D\u0430 \u0443\u0436\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u0430" });
  const res = await run(
    env,
    "INSERT INTO shifts (seller_id, start_time, notes, photos) VALUES (?, ?, ?, ?)",
    seller_id,
    nowISO(),
    notes,
    photos
  );
  return json({ success: true, shift_id: Number(res.meta.last_row_id) });
}
__name(createShiftWithNotes, "createShiftWithNotes");
async function updateShiftNotes(env, request) {
  const { seller_id, notes, photos } = await parseShiftForm(env, request);
  const shift = await first(env, "SELECT * FROM shifts WHERE seller_id = ? AND status = 'open'", seller_id);
  if (!shift)
    return json({ success: false, error: "\u041E\u0442\u043A\u0440\u044B\u0442\u0430\u044F \u0441\u043C\u0435\u043D\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" });
  const allPhotos = [shift.photos || "", photos].filter(Boolean).join(",");
  await run(env, "UPDATE shifts SET notes = ?, photos = ? WHERE id = ?", notes, allPhotos, shift.id);
  return json({ success: true, shift_id: shift.id });
}
__name(updateShiftNotes, "updateShiftNotes");
async function createSale(env, request) {
  const body = await reqJson(request);
  const { product_id, quantity, discount, discount_reason, payment_method, custom_price, seller_id, shift_id } = body;
  const shift = await first(env, "SELECT * FROM shifts WHERE id = ? AND status = 'open'", shift_id);
  if (!shift)
    return json({ error: "\u0421\u043C\u0435\u043D\u0430 \u043D\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u0430" }, 400);
  const product = await first(env, "SELECT price FROM products WHERE id = ?", product_id);
  if (!product)
    return json({ error: "\u0422\u043E\u0432\u0430\u0440 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D" }, 500);
  const stockRow = await first(
    env,
    "SELECT COALESCE(SUM(quantity), 0) as total_stock FROM product_stock WHERE product_id = ?",
    product_id
  );
  if (Number(stockRow.total_stock) < quantity)
    return json({ error: "\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0442\u043E\u0432\u0430\u0440\u0430" }, 400);
  const basePrice = custom_price ? Number(custom_price) : Number(product.price);
  const discountPercent = discount ? Number(discount) : 0;
  const finalPrice = basePrice * (1 - discountPercent / 100);
  const total = finalPrice * Number(quantity);
  await run(
    env,
    `
        INSERT INTO sales (product_id, quantity, discount, discount_reason, payment_method, custom_price, total, seller_id, shift_id, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    product_id,
    quantity,
    discountPercent,
    discount_reason || "",
    payment_method || "cash",
    custom_price || null,
    total,
    seller_id,
    shift_id,
    today()
  );
  const row = await first(
    env,
    "SELECT id, quantity FROM product_stock WHERE product_id = ? AND quantity > 0 ORDER BY id LIMIT 1",
    product_id
  );
  if (row) {
    const newQty = Math.max(0, Number(row.quantity) - Number(quantity));
    await run(env, "UPDATE product_stock SET quantity = ? WHERE id = ?", newQty, row.id);
  }
  return json({ success: true, total });
}
__name(createSale, "createSale");
async function salesToday(env) {
  const rows = await all(env, `
        SELECT sales.*, products.article, products.name, users.full_name as seller_name
        FROM sales
        JOIN products ON sales.product_id = products.id
        JOIN users ON sales.seller_id = users.id
        WHERE sales.date = ?
        ORDER BY sales.id DESC`, today());
  return json(rows);
}
__name(salesToday, "salesToday");
async function salesByShift(env, _request, params) {
  const rows = await all(env, `
        SELECT sales.*, products.article, products.name
        FROM sales JOIN products ON sales.product_id = products.id
        WHERE sales.shift_id = ? ORDER BY sales.id DESC`, params.shift_id);
  return json(rows);
}
__name(salesByShift, "salesByShift");
async function deleteSale(env, _request, params) {
  const sale = await first(env, "SELECT * FROM sales WHERE id = ?", params.id);
  if (!sale)
    return json({ error: "\u041F\u0440\u043E\u0434\u0430\u0436\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" }, 404);
  const shift = await first(env, "SELECT * FROM shifts WHERE id = ? AND status = 'open'", sale.shift_id);
  if (!shift)
    return json({ error: "\u0421\u043C\u0435\u043D\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430, \u043E\u0442\u043C\u0435\u043D\u0430 \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430" }, 400);
  const row = await first(env, "SELECT id FROM product_stock WHERE product_id = ? ORDER BY id LIMIT 1", sale.product_id);
  if (row) {
    await run(env, "UPDATE product_stock SET quantity = quantity + ? WHERE id = ?", sale.quantity, row.id);
  }
  await run(env, "DELETE FROM sales WHERE id = ?", params.id);
  return json({ success: true });
}
__name(deleteSale, "deleteSale");
async function productReports(env, request, params) {
  const { searchParams } = new URL(request.url);
  const date_from = searchParams.get("date_from");
  const date_to = searchParams.get("date_to");
  let query = `
        SELECT
            products.id, products.article, products.name, products.description,
            products.price, products.photo,
            SUM(sales.quantity) as total_quantity,
            SUM(sales.total) as total_sum,
            SUM(CASE WHEN sales.payment_method = 'cash' THEN sales.total ELSE 0 END) as cash_sum,
            SUM(CASE WHEN sales.payment_method = 'card' THEN sales.total ELSE 0 END) as card_sum,
            SUM(CASE WHEN sales.payment_method = 'certificate' THEN sales.total ELSE 0 END) as cert_sum
        FROM sales
        JOIN products ON sales.product_id = products.id
        WHERE sales.seller_id = ?`;
  const args = [params.seller_id];
  if (date_from) {
    query += " AND sales.date >= ?";
    args.push(date_from);
  }
  if (date_to) {
    query += " AND sales.date <= ?";
    args.push(date_to);
  }
  query += " GROUP BY products.id ORDER BY total_sum DESC";
  return json(await all(env, query, ...args));
}
__name(productReports, "productReports");
async function listTasks(env) {
  const rows = await all(env, `
        SELECT tasks.*, u1.full_name as assigned_name, u2.full_name as creator_name
        FROM tasks
        JOIN users u1 ON tasks.assigned_to = u1.id
        JOIN users u2 ON tasks.created_by = u2.id
        ORDER BY tasks.id DESC`);
  return json(rows);
}
__name(listTasks, "listTasks");
async function userTasks(env, _request, params) {
  return json(await all(env, "SELECT * FROM tasks WHERE assigned_to = ? ORDER BY id DESC", params.user_id));
}
__name(userTasks, "userTasks");
async function createTask(env, request) {
  const { text, assigned_to, created_by } = await reqJson(request);
  await run(
    env,
    "INSERT INTO tasks (text, assigned_to, created_by, created_at) VALUES (?, ?, ?, ?)",
    text,
    assigned_to,
    created_by,
    nowISO()
  );
  return json({ success: true });
}
__name(createTask, "createTask");
async function doneTask(env, _request, params) {
  await run(env, "UPDATE tasks SET status = 'done' WHERE id = ?", params.id);
  return json({ success: true });
}
__name(doneTask, "doneTask");
async function deleteTask(env, _request, params) {
  await run(env, "DELETE FROM tasks WHERE id = ?", params.id);
  return json({ success: true });
}
__name(deleteTask, "deleteTask");
async function createDocument(env, request) {
  const fd = await request.formData();
  const get = /* @__PURE__ */ __name((n) => (fd.get(n) || "").toString().trim(), "get");
  const user_id = get("user_id");
  const description = get("description");
  const amount = get("amount");
  const files = fd.getAll("photos").filter((f) => f && f.size);
  const paths = [];
  for (const f of files) {
    const p = await saveFile(env, f);
    if (p)
      paths.push(p);
  }
  const photos = paths.join(",");
  await run(
    env,
    "INSERT INTO documents (user_id, description, amount, photos, created_at) VALUES (?, ?, ?, ?, ?)",
    user_id,
    description,
    amount,
    photos,
    nowISO()
  );
  return json({ success: true });
}
__name(createDocument, "createDocument");
async function userDocuments(env, _request, params) {
  return json(await all(env, "SELECT * FROM documents WHERE user_id = ? ORDER BY id DESC", params.user_id));
}
__name(userDocuments, "userDocuments");
async function allDocuments(env) {
  const rows = await all(env, `
        SELECT documents.*, users.full_name
        FROM documents
        JOIN users ON documents.user_id = users.id
        ORDER BY documents.id DESC`);
  return json(rows);
}
__name(allDocuments, "allDocuments");
async function updateDocumentStatus(env, request, params) {
  const { status, admin_comment } = await reqJson(request);
  await run(
    env,
    "UPDATE documents SET status = ?, admin_comment = ? WHERE id = ?",
    status,
    admin_comment || "",
    params.id
  );
  return json({ success: true });
}
__name(updateDocumentStatus, "updateDocumentStatus");
async function deleteDocument(env, _request, params) {
  await run(env, "DELETE FROM documents WHERE id = ?", params.id);
  return json({ success: true });
}
__name(deleteDocument, "deleteDocument");
async function listNotifications(env, request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");
  if (user_id) {
    return json(await all(env, "SELECT * FROM notifications WHERE target_user_id = ? ORDER BY id DESC LIMIT 50", user_id));
  }
  return json(await all(env, "SELECT * FROM notifications ORDER BY id DESC LIMIT 50"));
}
__name(listNotifications, "listNotifications");
async function unreadCount(env, request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");
  let row;
  if (user_id) {
    row = await first(env, "SELECT COUNT(*) as count FROM notifications WHERE target_user_id = ? AND is_read = 0", user_id);
  } else {
    row = await first(env, "SELECT COUNT(*) as count FROM notifications WHERE is_read = 0");
  }
  return json({ count: Number(row.count) });
}
__name(unreadCount, "unreadCount");
async function readAll(env, request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");
  if (user_id) {
    await run(env, "UPDATE notifications SET is_read = 1 WHERE target_user_id = ? AND is_read = 0", user_id);
  } else {
    await run(env, "UPDATE notifications SET is_read = 1 WHERE is_read = 0");
  }
  return json({ success: true });
}
__name(readAll, "readAll");
var MONTH_RE = /^\d{4}-\d{2}$/;
__name(MONTH_RE, "MONTH_RE");
function currentMonth() {
  return nowISO().slice(0, 7);
}
__name(currentMonth, "currentMonth");
function nextMonth(month) {
  const y = Number(month.slice(0, 4));
  const m = Number(month.slice(5, 7));
  return m === 12 ? y + 1 + "-01-01" : y + "-" + String(m + 1).padStart(2, "0") + "-01";
}
__name(nextMonth, "nextMonth");
function money(n) {
  return Number(n || 0);
}
__name(money, "money");
async function listTransactions(env, request) {
  const { searchParams } = new URL(request.url);
  const requested = searchParams.get("month") || currentMonth();
  const month = requested === "all" ? "all" : MONTH_RE.test(requested) ? requested : currentMonth();
  let items;
  if (month === "all") {
    items = await all(env, `
            SELECT t.*, u.full_name as created_by_name
            FROM transactions t
            LEFT JOIN users u ON t.created_by = u.id
            ORDER BY t.date DESC, t.id DESC`);
  } else {
    items = await all(env, `
            SELECT t.*, u.full_name as created_by_name
            FROM transactions t
            LEFT JOIN users u ON t.created_by = u.id
            WHERE t.date >= ? AND t.date < ?
            ORDER BY t.date DESC, t.id DESC`, month + "-01", nextMonth(month));
  }
  const totals = { income: 0, expense: 0, balance: 0 };
  for (const it of items) {
    const amount = money(it.amount);
    if (it.type === "income")
      totals.income += amount;
    else
      totals.expense += amount;
  }
  totals.balance = totals.income - totals.expense;
  return json({ month, items, totals });
}
__name(listTransactions, "listTransactions");
async function transactionMonths(env) {
  const rows = await all(env, "SELECT DISTINCT substr(date, 1, 7) as m FROM transactions ORDER BY m DESC");
  const months = rows.map((r) => r.m).filter(Boolean);
  const cm = currentMonth();
  if (!months.includes(cm))
    months.unshift(cm);
  return json(months);
}
__name(transactionMonths, "transactionMonths");
async function transactionBalance(env) {
  const row = await first(env, `
        SELECT
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
        FROM transactions`);
  const income = money(row.income);
  const expense = money(row.expense);
  return json({ income, expense, balance: income - expense });
}
__name(transactionBalance, "transactionBalance");
async function createTransaction(env, request) {
  const b = await reqJson(request);
  const type = b.type === "expense" ? "expense" : b.type === "income" ? "income" : null;
  const amount = money(b.amount);
  if (!type)
    return fail("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0442\u0438\u043F \u0437\u0430\u043F\u0438\u0441\u0438", 400);
  if (!(amount > 0))
    return fail("\u0421\u0443\u043C\u043C\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0443\u043B\u044F", 400);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(b.date || "") ? b.date : today();
  await run(
    env,
    `INSERT INTO transactions (date, type, amount, description, source, shift_id, created_by, created_at)
         VALUES (?, ?, ?, ?, 'manual', NULL, ?, ?)`,
    date,
    type,
    amount,
    (b.description || "").toString(),
    b.created_by || null,
    nowISO()
  );
  return json({ success: true });
}
__name(createTransaction, "createTransaction");
async function updateTransaction(env, request, params) {
  const t = await first(env, "SELECT * FROM transactions WHERE id = ?", params.id);
  if (!t)
    return fail("\u0417\u0430\u043F\u0438\u0441\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430", 404);
  if (t.source !== "manual")
    return fail("\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u0437\u0430\u043F\u0438\u0441\u044C \u043D\u0435\u043B\u044C\u0437\u044F \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C", 400);
  const b = await reqJson(request);
  const type = b.type === "expense" ? "expense" : b.type === "income" ? "income" : t.type;
  const amount = b.amount === void 0 ? money(t.amount) : money(b.amount);
  if (!(amount > 0))
    return fail("\u0421\u0443\u043C\u043C\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0443\u043B\u044F", 400);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(b.date || "") ? b.date : t.date;
  const description = b.description === void 0 ? t.description : (b.description || "").toString();
  await run(
    env,
    "UPDATE transactions SET date = ?, type = ?, amount = ?, description = ? WHERE id = ?",
    date,
    type,
    amount,
    description,
    params.id
  );
  return json({ success: true });
}
__name(updateTransaction, "updateTransaction");
async function deleteTransaction(env, _request, params) {
  const t = await first(env, "SELECT * FROM transactions WHERE id = ?", params.id);
  if (!t)
    return fail("\u0417\u0430\u043F\u0438\u0441\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430", 404);
  if (t.source !== "manual")
    return fail("\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u0437\u0430\u043F\u0438\u0441\u044C \u043D\u0435\u043B\u044C\u0437\u044F \u0443\u0434\u0430\u043B\u0438\u0442\u044C", 400);
  await run(env, "DELETE FROM transactions WHERE id = ?", params.id);
  return json({ success: true });
}
__name(deleteTransaction, "deleteTransaction");
async function exportTransactions(env, request) {
  const { searchParams } = new URL(request.url);
  const requested = searchParams.get("month") || currentMonth();
  const month = requested === "all" ? "all" : MONTH_RE.test(requested) ? requested : currentMonth();
  const baseQuery = `
        SELECT t.*, u.full_name as created_by_name
        FROM transactions t
        LEFT JOIN users u ON t.created_by = u.id`;
  let items;
  if (month === "all") {
    items = await all(env, baseQuery + " ORDER BY t.date ASC, t.id ASC");
  } else {
    items = await all(env, baseQuery + " WHERE t.date >= ? AND t.date < ? ORDER BY t.date ASC, t.id ASC", month + "-01", nextMonth(month));
  }
  const esc = /* @__PURE__ */ __name((v) => {
    const s = v == null ? "" : String(v);
    return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }, "esc");
  const num = /* @__PURE__ */ __name((n) => Number(n || 0).toFixed(2).replace(".", ","), "num");
  let income = 0;
  let expense = 0;
  const lines = ["Дата;Тип;Сумма;Описание;Источник;Кто"];
  for (const t of items) {
    const amount = Number(t.amount || 0);
    if (t.type === "income")
      income += amount;
    else
      expense += amount;
    lines.push([
      t.date,
      t.type === "income" ? "Доход" : "Расход",
      num(amount),
      t.description || "",
      t.source === "auto_shift" ? "Авто (смена)" : "Вручную",
      t.created_by_name || ""
    ].map(esc).join(";"));
  }
  lines.push("");
  lines.push(["Итого доходов", "", num(income), "", "", ""].map(esc).join(";"));
  lines.push(["Итого расходов", "", num(expense), "", "", ""].map(esc).join(";"));
  lines.push(["Сальдо", "", num(income - expense), "", "", ""].map(esc).join(";"));
  const csv = "\uFEFF" + lines.join("\r\n");
  const filename = "finance-" + (month === "all" ? "all" : month) + ".csv";
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="' + filename + '"'
    }
  });
}
__name(exportTransactions, "exportTransactions");
var routes = [
  ["POST", "/api/login", login],
  ["GET", "/api/users", listUsers],
  ["POST", "/api/users", createUser],
  ["PUT", "/api/users/:id", updateUser],
  ["DELETE", "/api/users/:id", deleteUser],
  ["GET", "/api/categories", listCategories],
  ["POST", "/api/categories", createCategory],
  ["PUT", "/api/categories/:id", updateCategory],
  ["DELETE", "/api/categories/:id", deleteCategory],
  ["GET", "/api/tcs", listTcs],
  ["POST", "/api/tcs", createTc],
  ["PUT", "/api/tcs/:id", updateTc],
  ["DELETE", "/api/tcs/:id", deleteTc],
  ["GET", "/api/products/category/:category_id", listProductsByCategory],
  ["GET", "/api/products/:id/stock", productStock],
  ["GET", "/api/products", listProducts],
  ["POST", "/api/products", createProduct],
  ["PUT", "/api/products/:id", updateProduct],
  ["DELETE", "/api/products/:id", deleteProduct],
  ["POST", "/api/product-stock", upsertProductStock],
  ["POST", "/api/shifts/start", startShift],
  ["POST", "/api/shifts/create", createShiftWithNotes],
  ["POST", "/api/shifts/update-notes", updateShiftNotes],
  ["GET", "/api/shifts/current/:seller_id", currentShift],
  ["POST", "/api/shifts/close", closeShift],
  ["GET", "/api/shifts/closed", closedShifts],
  ["GET", "/api/shifts/my/:seller_id", myShifts],
  ["POST", "/api/sales", createSale],
  ["GET", "/api/sales/today", salesToday],
  ["GET", "/api/sales/shift/:shift_id", salesByShift],
  ["DELETE", "/api/sales/:id", deleteSale],
  ["GET", "/api/reports/products/:seller_id", productReports],
  ["GET", "/api/tasks/user/:user_id", userTasks],
  ["GET", "/api/tasks", listTasks],
  ["POST", "/api/tasks", createTask],
  ["PUT", "/api/tasks/:id/done", doneTask],
  ["DELETE", "/api/tasks/:id", deleteTask],
  ["POST", "/api/documents", createDocument],
  ["GET", "/api/documents/user/:user_id", userDocuments],
  ["GET", "/api/documents/all", allDocuments],
  ["PUT", "/api/documents/:id/status", updateDocumentStatus],
  ["DELETE", "/api/documents/:id", deleteDocument],
  ["GET", "/api/notifications", listNotifications],
  ["GET", "/api/notifications/unread-count", unreadCount],
  ["POST", "/api/notifications/read-all", readAll],
  ["GET", "/api/transactions", listTransactions],
  ["GET", "/api/transactions/months", transactionMonths],
  ["GET", "/api/transactions/balance", transactionBalance],
  ["POST", "/api/transactions", createTransaction],
  ["PUT", "/api/transactions/:id", updateTransaction],
  ["DELETE", "/api/transactions/:id", deleteTransaction],
  ["GET", "/api/transactions/export", exportTransactions]
];
async function handleApi(env, request, url) {
  const { pathname } = url;
  const method = request.method;
  for (const [m, pattern, handler] of routes) {
    if (method !== m)
      continue;
    const params = match(pattern, pathname);
    if (params !== null) {
      try {
        return await handler(env, request, params);
      } catch (e) {
        return fail(e.message);
      }
    }
  }
  return json({ error: "Not found" }, 404);
}
__name(handleApi, "handleApi");
var src_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;
    if (pathname.startsWith("/api/"))
      return handleApi(env, request, url);
    if (pathname.startsWith("/uploads/"))
      return serveUpload(env, url);
    if (pathname === "/" || pathname === "")
      return env.ASSETS.fetch(new Request("https://assets.local/login.html"));
    return env.ASSETS.fetch(request);
  }
};
export {
  src_default as default
};


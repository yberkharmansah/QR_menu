const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env");
const catalogPath = path.join(root, "exports", "catalog-live.json");
const outputPath = path.join(root, "exports", "menu-tek-sayfa.html");

const groupMeta = {
  drinks: { title: "Icecekler" },
  foods: { title: "Yiyecekler" },
};

const preferredOrder = {
  drinks: [
    "hot-coffee",
    "hot-drinks",
    "teas",
    "soft-drinks",
    "fresh-juices",
    "cocktails",
    "frozen",
    "milkshake",
  ],
  foods: [
    "breakfast",
    "toasts",
    "gozleme",
    "soups",
    "appetizers",
    "fix",
    "salads-bowls",
    "pastas",
    "mains",
    "wraps",
    "pizzas",
    "burgers",
    "desserts",
  ],
};

function normalizeTr(text) {
  return String(text || "")
    .replace(/\bIcecekler\b/g, "İçecekler")
    .replace(/\bIcecek\b/g, "İçecek")
    .replace(/\bSicak\b/g, "Sıcak")
    .replace(/\bSoguk\b/g, "Soğuk")
    .replace(/\bMesrubatlar\b/g, "Meşrubatlar")
    .replace(/\bCaylar\b/g, "Çaylar")
    .replace(/\bCay\b/g, "Çay")
    .replace(/\bCorba\b/g, "Çorba")
    .replace(/\bGozleme\b/g, "Gözleme")
    .replace(/\bGozlemeler\b/g, "Gözlemeler")
    .replace(/\bKahvalti\b/g, "Kahvaltı")
    .replace(/\bTatlilar\b/g, "Tatlılar")
    .replace(/\bSıkma Meyve Sulari\b/g, "Sıkma Meyve Suları")
    .replace(/\bCilek\b/g, "Çilek")
    .replace(/\bCarkifelek\b/g, "Çarkıfelek")
    .replace(/\bGunun\b/g, "Günün");
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    env[key] = val;
  }
  return env;
}

function firestoreValueToJs(node) {
  if (!node || typeof node !== "object") return node;
  if ("stringValue" in node) return node.stringValue;
  if ("integerValue" in node) return Number(node.integerValue || 0);
  if ("doubleValue" in node) return Number(node.doubleValue || 0);
  if ("booleanValue" in node) return Boolean(node.booleanValue);
  if ("nullValue" in node) return null;
  if ("timestampValue" in node) return node.timestampValue;
  if ("mapValue" in node) {
    const out = {};
    const fields = node.mapValue?.fields || {};
    Object.keys(fields).forEach((key) => {
      out[key] = firestoreValueToJs(fields[key]);
    });
    return out;
  }
  if ("arrayValue" in node) {
    const values = node.arrayValue?.values || [];
    return values.map((entry) => firestoreValueToJs(entry));
  }
  return undefined;
}

function firestoreDocToJs(doc) {
  const fields = doc?.fields || {};
  const out = {};
  Object.keys(fields).forEach((key) => {
    out[key] = firestoreValueToJs(fields[key]);
  });
  return out;
}

async function fetchFirestoreCollection(projectId, apiKey, collectionName) {
  let url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    projectId
  )}/databases/(default)/documents/${encodeURIComponent(collectionName)}?pageSize=500&key=${encodeURIComponent(apiKey)}`;

  const rows = [];
  for (let i = 0; i < 20; i += 1) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Firestore ${collectionName} cekilemedi: HTTP ${response.status}`);
    }
    const json = await response.json();
    const docs = Array.isArray(json.documents) ? json.documents : [];
    docs.forEach((doc) => {
      const id = String(doc.name || "").split("/").pop();
      rows.push({ id, ...firestoreDocToJs(doc) });
    });
    if (!json.nextPageToken) break;
    url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
      projectId
    )}/databases/(default)/documents/${encodeURIComponent(
      collectionName
    )}?pageSize=500&pageToken=${encodeURIComponent(json.nextPageToken)}&key=${encodeURIComponent(apiKey)}`;
  }
  return rows;
}

async function loadCatalog() {
  const env = { ...parseDotEnv(envPath), ...process.env };
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = env.VITE_FIREBASE_API_KEY;

  if (projectId && apiKey) {
    try {
      const [categories, products] = await Promise.all([
        fetchFirestoreCollection(projectId, apiKey, "categories"),
        fetchFirestoreCollection(projectId, apiKey, "products"),
      ]);
      const fresh = { categories, products };
      fs.writeFileSync(catalogPath, JSON.stringify(fresh, null, 2), "utf8");
      console.log("Firestore'dan guncel katalog alindi ve catalog-live.json yazildi.");
      return fresh;
    } catch (error) {
      console.warn("Firestore cekimi basarisiz. Local catalog-live.json kullaniliyor.");
      console.warn(String(error?.message || error));
    }
  }

  if (!fs.existsSync(catalogPath)) {
    throw new Error(`catalog-live.json bulunamadi: ${catalogPath}`);
  }
  return JSON.parse(fs.readFileSync(catalogPath, "utf8"));
}

function sortCategories(categories, groupId) {
  const orderMap = new Map((preferredOrder[groupId] || []).map((id, index) => [id, index]));
  return categories
    .filter((category) => category.groupId === groupId)
    .sort((a, b) => {
      const ai = orderMap.has(a.id) ? orderMap.get(a.id) : 999;
      const bi = orderMap.has(b.id) ? orderMap.get(b.id) : 999;
      if (ai !== bi) return ai - bi;
      return normalizeTr(a.titleTr).localeCompare(normalizeTr(b.titleTr), "tr");
    });
}

function formatPrice(value) {
  const price = Number(value);
  if (!Number.isFinite(price)) return "0 TL";
  return `${price.toLocaleString("tr-TR")} TL`;
}

function buildCategoryHtml(category, products) {
  const rows = products
    .filter((product) => product.categoryId === category.id)
    .filter((product) => String(product.nameTr || "").trim().length > 0)
    .sort((a, b) => normalizeTr(a.nameTr).localeCompare(normalizeTr(b.nameTr), "tr"))
    .map(
      (product) =>
        `<li><span class="item-name">${htmlEscape(normalizeTr(
          product.nameTr
        ))}</span><span class="dots"></span><span class="price">${htmlEscape(formatPrice(product.price))}</span></li>`
    )
    .join("");

  if (!rows) return "";
  return `<section class="category"><h3>${htmlEscape(normalizeTr(category.titleTr))}</h3><ul>${rows}</ul></section>`;
}

function buildColumnHtml(groupId, categories, products) {
  const sections = sortCategories(categories, groupId)
    .map((category) => buildCategoryHtml(category, products))
    .filter(Boolean)
    .join("");

  return `
      <article class="col">
        <h2 class="col-title">${groupMeta[groupId].title}</h2>
        <div class="col-content">
          ${sections}
        </div>
      </article>`;
}

function buildHtml(data) {
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const products = Array.isArray(data.products) ? data.products : [];

  const drinksColumn = buildColumnHtml("drinks", categories, products);
  const foodsColumn = buildColumnHtml("foods", categories, products);

  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cremore Tek Sayfa Menu</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;800;900&display=swap" rel="stylesheet" />
  <style>
    @page {
      size: A4 landscape;
      margin: 6mm;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #fff;
      color: #0f5a3a;
      font-family: "Noto Sans", "Segoe UI", Arial, sans-serif;
    }
    .print-btn {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 20;
      border: 1px solid #0f5a3a;
      background: #fff;
      color: #0f5a3a;
      font-weight: 800;
      border-radius: 999px;
      padding: 8px 14px;
      cursor: pointer;
    }
    .sheet {
      width: 297mm;
      height: 210mm;
      margin: 0 auto;
      padding: 6mm;
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 4px;
      overflow: hidden;
    }
    .header { text-align: center; }
    .logo-wrap {
      width: 58px;
      height: 58px;
      border-radius: 16px;
      margin: 0 auto 2px;
      overflow: hidden;
      border: 2px solid #0f5a3a;
    }
    .logo-wrap img { width: 100%; height: 100%; object-fit: cover; }
    h1 { margin: 0; font-size: 18px; letter-spacing: 0.3px; font-weight: 900; }
    .subtitle { margin: 1px 0 0; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }

    .columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6mm;
      min-height: 0;
      overflow: hidden;
    }
    .col { min-width: 0; min-height: 0; }
    .col-title {
      margin: 0 0 2px;
      padding-bottom: 1px;
      border-bottom: 2px solid #0f5a3a;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .col-content {
      column-count: 2;
      column-gap: 4mm;
      height: calc(100% - 16px);
      overflow: hidden;
    }
    .category {
      break-inside: avoid;
      margin-bottom: 4px;
      display: inline-block;
      width: 100%;
    }
    .category h3 { margin: 0 0 2px; font-size: 9.2px; font-weight: 900; }
    .category ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 1px; }
    .category li { display: grid; grid-template-columns: auto 1fr auto; gap: 4px; align-items: baseline; font-size: 8.2px; line-height: 1.1; }
    .item-name { font-weight: 700; }
    .dots { border-bottom: 1px dotted #6ca88b; transform: translateY(-1px); }
    .price { font-weight: 800; white-space: nowrap; }

    @media print {
      .print-btn { display: none; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Yazdir</button>

  <main class="sheet">
    <header class="header">
      <div class="logo-wrap">
        <img src="../src/assets/cremore-logo.jpg" alt="Cremore Logo" />
      </div>
      <h1>CREMORE MENU</h1>
      <p class="subtitle">Tum Urunler ve Fiyatlar</p>
    </header>

    <section class="columns">
      ${drinksColumn}
      ${foodsColumn}
    </section>
  </main>
</body>
</html>`;
}

async function main() {
  const data = await loadCatalog();
  const html = buildHtml(data);
  fs.writeFileSync(outputPath, html, "utf8");
  console.log(`Tek sayfa menu olusturuldu: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

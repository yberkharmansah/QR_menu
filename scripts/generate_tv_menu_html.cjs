const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const catalogPath = path.join(root, 'exports', 'catalog-live.json');
const outputDrinksPath = path.join(root, 'exports', 'menu-tv-icecekler.html');
const outputFoodsPath = path.join(root, 'exports', 'menu-tv-yiyecekler.html');

const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const groupMeta = {
  drinks: {
    title: 'İçecekler',
    subtitle: 'Sıcak, soğuk ve özel içecekler',
  },
  foods: {
    title: 'Yiyecekler',
    subtitle: 'Kahvaltı, ana yemek, atıştırmalık ve tatlılar',
  },
};

const preferredOrder = {
  drinks: ['hot-coffee-classic', 'hot-coffee-special', 'soft-drinks', 'cocktails', 'frozen', 'teas', 'hot-drinks', 'fresh-juices', 'milkshake'],
  foods: ['breakfast', 'toasts', 'gozleme', 'soups', 'appetizers', 'fix', 'salads-bowls', 'pastas', 'mains', 'wraps', 'pizzas', 'burgers', 'desserts'],
};

const hotCoffeeClassicIds = new Set([
  'espresso-double',
  'espresso-single',
  'americano',
  'cafe-latte',
  'cappuchino',
  'filtre-kahve',
  'turk-kahvesi',
  'flat-white',
  'cortudo',
]);

function normalizeTr(text) {
  return String(text)
    .replace(/\bIcecekler\b/g, 'İçecekler')
    .replace(/\bIcecek\b/g, 'İçecek')
    .replace(/\bSicak\b/g, 'Sıcak')
    .replace(/\bSoguk\b/g, 'Soğuk')
    .replace(/\bMesrubatlar\b/g, 'Meşrubatlar')
    .replace(/\bCaylar\b/g, 'Çaylar')
    .replace(/\bCay\b/g, 'Çay')
    .replace(/\bCorba\b/g, 'Çorba')
    .replace(/\bGozleme\b/g, 'Gözleme')
    .replace(/\bGozlemeler\b/g, 'Gözlemeler')
    .replace(/\bKahvalti\b/g, 'Kahvaltı')
    .replace(/\bTatlilar\b/g, 'Tatlılar')
    .replace(/\bSıkma Meyve Sulari\b/g, 'Sıkma Meyve Suları')
    .replace(/\bCilek\b/g, 'Çilek')
    .replace(/\bCarkifelek\b/g, 'Çarkıfelek')
    .replace(/\bGunun\b/g, 'Günün');
}

function displayCategoryTitle(title) {
  if (title === 'Kokteyl') return 'Kokteyller';
  return title;
}

const categories = data.categories.map((category) => ({
  id: category.id,
  groupId: category.groupId,
  title: normalizeTr(category.titleTr),
}));

let products = data.products.map((product) => ({
  id: product.id,
  categoryId: product.categoryId,
  name: normalizeTr(product.nameTr),
  price: Number(product.price) || 0,
})).filter(
  (product) =>
    product.name.toLowerCase() !== 'ayran' &&
    product.name.toLowerCase() !== 'zebra mocha',
);

if (!products.some((product) => product.id === 'magnolia')) {
  products.push({
    id: 'magnolia',
    categoryId: 'desserts',
    name: 'Magnolia',
    price: 150,
  });
}

const bitkiCayi = products.find(
  (product) =>
    product.categoryId === 'teas' &&
    /bitki/i.test(product.name),
);

products = products.filter(
  (product) => !(product.categoryId === 'teas' && /bitki/i.test(product.name)),
);

const herbalTeaPrice = bitkiCayi ? bitkiCayi.price : 60;
products.push(
  { id: 'herbal-ihlamur', categoryId: 'teas', name: 'Ihlamur', price: herbalTeaPrice },
  { id: 'herbal-kis-burnu', categoryId: 'teas', name: 'Kış Burnu', price: herbalTeaPrice },
  { id: 'herbal-kis-cayi', categoryId: 'teas', name: 'Kış Çayı', price: herbalTeaPrice },
  { id: 'herbal-nane-limon', categoryId: 'teas', name: 'Nane Limon', price: herbalTeaPrice },
);

function formatPrice(price) {
  return `${price.toLocaleString('tr-TR')} TL`;
}

function buildBlocks(groupId) {
  const order = new Map((preferredOrder[groupId] || []).map((id, i) => [id, i]));
  const cats = categories
    .filter((category) => category.groupId === groupId)
    .map((category) => {
      if (groupId === 'drinks' && category.id === 'hot-coffee') {
        return [
          { id: 'hot-coffee-classic', groupId: category.groupId, title: 'Sıcak Kahveler - Klasikler', sourceCategoryId: 'hot-coffee' },
          { id: 'hot-coffee-special', groupId: category.groupId, title: 'Sıcak Kahveler - Özel', sourceCategoryId: 'hot-coffee' },
        ];
      }
      return [{ ...category, sourceCategoryId: category.id }];
    })
    .flat()
    .sort((a, b) => {
      const ai = order.has(a.id) ? order.get(a.id) : 999;
      const bi = order.has(b.id) ? order.get(b.id) : 999;
      if (ai !== bi) return ai - bi;
      return a.title.localeCompare(b.title, 'tr');
    });

  return cats.map((category) => {
    let items = products
      .filter((product) => product.categoryId === category.sourceCategoryId)
      .sort((a, b) => a.name.localeCompare(b.name, 'tr'));

    if (category.id === 'hot-coffee-classic') {
      items = items.filter((item) => hotCoffeeClassicIds.has(item.id));
    } else if (category.id === 'hot-coffee-special') {
      items = items.filter((item) => !hotCoffeeClassicIds.has(item.id));
    }

    return {
      id: category.id,
      title: displayCategoryTitle(category.title),
      items,
      weight: items.length + 1,
    };
  }).filter((block) => block.items.length > 0);
}

function makeColumns(blocks, columnCount) {
  const columns = Array.from({ length: columnCount }, () => ({ blocks: [], weight: 0 }));
  const sorted = blocks.slice().sort((a, b) => b.weight - a.weight);

  for (const block of sorted) {
    let bestIndex = 0;
    let minWeight = Number.POSITIVE_INFINITY;
    for (let i = 0; i < columns.length; i += 1) {
      if (columns[i].weight < minWeight) {
        minWeight = columns[i].weight;
        bestIndex = i;
      }
    }
    columns[bestIndex].blocks.push(block);
    columns[bestIndex].weight += block.weight;
  }

  return columns;
}

function findBestPairs(columns) {
  const indexes = columns.map((_, i) => i);
  let bestPairs = [];
  let bestScore = Number.POSITIVE_INFINITY;

  function recurse(remaining, pairs) {
    if (remaining.length === 0) {
      const score = pairs.reduce((sum, [a, b]) => sum + Math.abs(columns[a].weight - columns[b].weight), 0);
      if (score < bestScore) {
        bestScore = score;
        bestPairs = pairs.slice();
      }
      return;
    }

    const first = remaining[0];
    for (let i = 1; i < remaining.length; i += 1) {
      const second = remaining[i];
      const next = remaining.filter((idx) => idx !== first && idx !== second);
      recurse(next, [...pairs, [first, second]]);
    }
  }

  recurse(indexes, []);
  return bestPairs;
}

function buildPagesFromColumns(columns, pageCount) {
  const pairs = findBestPairs(columns);
  const pages = pairs.map(([a, b]) => {
    const colA = columns[a];
    const colB = columns[b];
    const left = colA.weight >= colB.weight ? colA : colB;
    const right = colA.weight >= colB.weight ? colB : colA;
    return {
      left: left.blocks,
      right: right.blocks,
      totalWeight: left.weight + right.weight,
    };
  });

  pages.sort((a, b) => b.totalWeight - a.totalWeight);

  while (pages.length < pageCount) {
    pages.push({ left: [], right: [], totalWeight: 0 });
  }

  return pages.slice(0, pageCount);
}

function buildBalancedPages(blocks, pageCount) {
  const columnCount = pageCount * 2;
  const columns = makeColumns(blocks, columnCount);
  return buildPagesFromColumns(columns, pageCount);
}

function buildFoodsManualPages(blocks) {
  const filteredBlocks = blocks.filter((block) => block.id !== 'gozleme');
  const byId = new Map(filteredBlocks.map((block) => [block.id, block]));
  const used = new Set();
  const take = (id) => {
    const block = byId.get(id);
    if (!block) return null;
    used.add(id);
    return block;
  };
  const pickMany = (ids) => ids.map(take).filter(Boolean);

  // Keep the already approved page as-is.
  const pageApproved = {
    left: pickMany(['mains', 'pastas', 'wraps']),
    right: pickMany(['pizzas', 'salads-bowls', 'fix']),
    totalWeight: 0,
  };

  // Rebalance the other page (requested test layout).
  const pageAdjusted = {
    left: pickMany(['breakfast', 'toasts', 'soups']),
    right: pickMany(['desserts', 'appetizers', 'burgers']),
    totalWeight: 0,
  };

  const leftovers = filteredBlocks.filter((block) => !used.has(block.id));
  for (const block of leftovers) {
    const leftWeight = pageAdjusted.left.reduce((sum, b) => sum + b.weight, 0);
    const rightWeight = pageAdjusted.right.reduce((sum, b) => sum + b.weight, 0);
    if (leftWeight <= rightWeight) pageAdjusted.left.push(block);
    else pageAdjusted.right.push(block);
  }

  pageApproved.totalWeight =
    pageApproved.left.reduce((sum, b) => sum + b.weight, 0) +
    pageApproved.right.reduce((sum, b) => sum + b.weight, 0);
  pageAdjusted.totalWeight =
    pageAdjusted.left.reduce((sum, b) => sum + b.weight, 0) +
    pageAdjusted.right.reduce((sum, b) => sum + b.weight, 0);

  return [pageApproved, pageAdjusted];
}

function buildDrinksManualPages(blocks) {
  const byId = new Map(blocks.map((block) => [block.id, block]));
  const used = new Set();
  const take = (id) => {
    const block = byId.get(id);
    if (!block) return null;
    used.add(id);
    return block;
  };
  const pickMany = (ids) => ids.map(take).filter(Boolean);

  // First page fixed layout (exact user request).
  const pageFirst = {
    left: pickMany(['soft-drinks', 'fresh-juices']),
    right: pickMany(['hot-coffee-classic', 'frozen']),
    totalWeight: 0,
  };

  // Second page fixed layout (exact user request).
  const pageSecond = {
    left: pickMany(['hot-coffee-special', 'hot-drinks', 'milkshake']),
    right: pickMany(['cocktails', 'teas']),
    totalWeight: 0,
  };

  const leftovers = blocks.filter((block) => !used.has(block.id));
  for (const block of leftovers) {
    const leftWeight = pageSecond.left.reduce((sum, b) => sum + b.weight, 0);
    const rightWeight = pageSecond.right.reduce((sum, b) => sum + b.weight, 0);
    if (leftWeight <= rightWeight) pageSecond.left.push(block);
    else pageSecond.right.push(block);
  }

  pageFirst.totalWeight =
    pageFirst.left.reduce((sum, b) => sum + b.weight, 0) +
    pageFirst.right.reduce((sum, b) => sum + b.weight, 0);
  pageSecond.totalWeight =
    pageSecond.left.reduce((sum, b) => sum + b.weight, 0) +
    pageSecond.right.reduce((sum, b) => sum + b.weight, 0);

  return [pageFirst, pageSecond];
}

function renderCategory(block) {
  const itemsHtml = block.items
    .map((item) => `
      <li class="itemRow">
        <span class="itemName">${item.name}</span>
        <span class="itemDot"></span>
        <span class="itemPrice">${formatPrice(item.price)}</span>
      </li>`)
    .join('');

  return `
    <section class="categoryCard">
      <h3>${block.title}</h3>
      <ul class="itemList">${itemsHtml}
      </ul>
    </section>`;
}

function renderColumn(blocks) {
  return blocks.map((block) => renderCategory(block)).join('');
}

function renderPage(groupId, page, index) {
  const meta = groupMeta[groupId];
  return `
    <section class="menuPage" data-index="${index}">
      <div class="bg glowA"></div>
      <div class="bg glowB"></div>

      <header class="top">
        <div class="logoWrap">
          <img src="../src/assets/cremore-logo.jpg" alt="Cremore Logo" />
        </div>
        <p class="brand">CREMORE COFFEE</p>
        <h1>${meta.title}</h1>
        <p class="sub">${meta.subtitle}</p>
      </header>

      <main class="grid">
        <article class="col">${renderColumn(page.left)}</article>
        <article class="col">${renderColumn(page.right)}</article>
      </main>
    </section>`;
}

function htmlTemplate(groupId, pages, pageDurationMs) {
  const renderedPages = pages.map((page, i) => renderPage(groupId, page, i)).join('');

  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cremore TV Menu - ${groupMeta[groupId].title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg0: #06120e;
      --bg1: #0a2a1f;
      --bg2: #124432;
      --panel: rgba(255, 255, 255, 0.07);
      --stroke: rgba(255, 255, 255, 0.17);
      --text: #eef6f2;
      --muted: #c7d9d0;
      --accent: #9ee8c2;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: radial-gradient(circle at 18% 12%, var(--bg2), var(--bg1) 42%, var(--bg0) 100%);
      color: var(--text);
      font-family: 'Manrope', 'Segoe UI', sans-serif;
    }

    .deck {
      position: relative;
      width: 100vw;
      height: 100vh;
    }

    .menuPage {
      position: absolute;
      inset: 0;
      padding: 26px 36px 24px;
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 16px;
      opacity: 0;
      pointer-events: none;
      transform: perspective(1000px) translateY(24px) scale(0.97);
      filter: blur(8px);
      transition: opacity 900ms cubic-bezier(0.2, 0.75, 0.2, 1),
        transform 900ms cubic-bezier(0.2, 0.75, 0.2, 1),
        filter 900ms cubic-bezier(0.2, 0.75, 0.2, 1);
      overflow: hidden;
    }

    .menuPage.is-active {
      opacity: 1;
      pointer-events: auto;
      transform: perspective(1000px) translateY(0) scale(1);
      filter: blur(0);
    }

    .bg {
      position: absolute;
      border-radius: 999px;
      pointer-events: none;
      opacity: 0.17;
      z-index: 0;
      filter: blur(2px);
    }

    .glowA {
      width: 520px;
      height: 520px;
      top: -180px;
      right: -150px;
      background: radial-gradient(circle, #3fd293 0%, rgba(63, 210, 147, 0) 70%);
    }

    .glowB {
      width: 520px;
      height: 520px;
      bottom: -220px;
      left: -170px;
      background: radial-gradient(circle, #79c7a3 0%, rgba(121, 199, 163, 0) 72%);
    }

    .top,
    .grid {
      position: relative;
      z-index: 1;
    }

    .top {
      text-align: center;
      min-height: 172px;
      display: grid;
      justify-items: center;
      align-content: center;
      gap: 7px;
    }

    .logoWrap {
      width: 80px;
      height: 80px;
      border-radius: 22px;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.36);
      background: #fff;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    }

    .logoWrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .brand {
      margin: 0;
      font-size: 13px;
      letter-spacing: 2.2px;
      font-weight: 800;
      color: var(--accent);
    }

    .top h1 {
      margin: 0;
      font-family: 'Barlow', 'Manrope', sans-serif;
      font-size: clamp(40px, 4.6vw, 62px);
      line-height: 1;
      font-weight: 800;
    }

    .sub {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: var(--muted);
    }

    .grid {
      min-height: 0;
      height: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      align-content: center;
      align-items: start;
    }

    .col {
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 6px;
    }

    .categoryCard {
      border: 1px solid var(--stroke);
      background: var(--panel);
      border-radius: 14px;
      padding: 10px 12px;
      backdrop-filter: blur(7px);
    }

    .categoryCard h3 {
      margin: 0 0 6px;
      font-family: 'Barlow', 'Manrope', sans-serif;
      font-size: 30px;
      line-height: 1.02;
      color: var(--accent);
      font-weight: 700;
    }

    .itemList {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 1px;
    }

    .itemRow {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
      font-size: 19px;
      line-height: 1.14;
    }

    .itemName {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 600;
    }

    .itemDot {
      border-bottom: 1px dotted rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }

    .itemPrice {
      white-space: nowrap;
      font-family: 'Barlow', 'Manrope', sans-serif;
      font-weight: 800;
    }

    @media (max-width: 1500px), (max-height: 860px) {
      .menuPage { padding: 20px 28px 20px; gap: 12px; }
      .top { min-height: 142px; }
      .logoWrap { width: 68px; height: 68px; border-radius: 18px; }
      .brand { font-size: 12px; }
      .sub { font-size: 13px; }
      .categoryCard h3 { font-size: 24px; margin-bottom: 5px; }
      .itemRow { font-size: 16px; line-height: 1.12; }
      .col { gap: 5px; }
    }
  </style>
</head>
<body>
  <div class="deck">${renderedPages}</div>

  <script>
    const pages = Array.from(document.querySelectorAll('.menuPage'));
    let active = 0;

    function show(index) {
      active = (index + pages.length) % pages.length;
      pages.forEach((page, i) => page.classList.toggle('is-active', i === active));
    }

    function isFullscreen() {
      return Boolean(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    }

    async function enterFullscreen() {
      const root = document.documentElement;
      if (root.requestFullscreen) return root.requestFullscreen();
      if (root.webkitRequestFullscreen) return root.webkitRequestFullscreen();
      if (root.msRequestFullscreen) return root.msRequestFullscreen();
      return Promise.resolve();
    }

    async function exitFullscreen() {
      if (document.exitFullscreen) return document.exitFullscreen();
      if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
      if (document.msExitFullscreen) return document.msExitFullscreen();
      return Promise.resolve();
    }

    async function toggleFullscreen() {
      try {
        if (isFullscreen()) await exitFullscreen();
        else await enterFullscreen();
      } catch (_) {
        // Ignore fullscreen gesture related issues.
      }
    }

    show(0);
    setInterval(() => show(active + 1), ${pageDurationMs});

    document.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleFullscreen();
      }
    });
  </script>
</body>
</html>`;
}

function buildExport(groupId, pageCount, pageDurationMs) {
  const blocks = buildBlocks(groupId);
  const pages =
    groupId === 'foods' && pageCount === 2
      ? buildFoodsManualPages(blocks)
      : groupId === 'drinks' && pageCount === 2
      ? buildDrinksManualPages(blocks)
      : buildBalancedPages(blocks, pageCount);
  return htmlTemplate(groupId, pages, pageDurationMs);
}

const drinksHtml = buildExport('drinks', 2, 12000);
const foodsHtml = buildExport('foods', 2, 12000);

fs.writeFileSync(outputDrinksPath, drinksHtml, 'utf8');
fs.writeFileSync(outputFoodsPath, foodsHtml, 'utf8');

console.log(`TV drinks menu generated: ${outputDrinksPath}`);
console.log(`TV foods menu generated: ${outputFoodsPath}`);

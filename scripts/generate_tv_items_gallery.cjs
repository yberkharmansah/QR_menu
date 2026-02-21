const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const itemsDir = path.join(root, "exports", "items");
const outputPath = path.join(root, "exports", "menu-tv-items.html");

if (!fs.existsSync(itemsDir)) {
  throw new Error("exports/items klasoru bulunamadi.");
}

const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function numericAwareSort(a, b) {
  const stemA = path.parse(a).name.trim();
  const stemB = path.parse(b).name.trim();
  const numA = Number(stemA);
  const numB = Number(stemB);
  const isNumA = Number.isFinite(numA) && String(numA) === stemA;
  const isNumB = Number.isFinite(numB) && String(numB) === stemB;

  if (isNumA && isNumB) return numA - numB;
  if (isNumA) return -1;
  if (isNumB) return 1;
  return stemA.localeCompare(stemB, "tr", { numeric: true, sensitivity: "base" });
}

const files = fs
  .readdirSync(itemsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => allowedExt.has(path.extname(name).toLowerCase()))
  .sort(numericAwareSort);

if (files.length === 0) {
  throw new Error("exports/items klasorunde gosterilecek resim yok.");
}

const imagePaths = files.map((name) => `/exports/items/${encodeURIComponent(name)}`);

const html = `<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cremore TV Items</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@600;700;800;900&family=Manrope:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg-a: #091b15;
      --bg-b: #12362a;
      --panel: rgba(255, 255, 255, 0.08);
      --stroke: rgba(255, 255, 255, 0.2);
      --text: #f3faf6;
      --accent: #7ee5b8;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      color: var(--text);
      font-family: "Manrope", "Segoe UI", sans-serif;
      background: radial-gradient(circle at 18% 10%, #1f634a 0%, var(--bg-b) 40%, var(--bg-a) 100%);
    }

    .page {
      width: 100vw;
      height: 100vh;
      padding: 0;
      position: relative;
      isolation: isolate;
      overflow: hidden;
    }

    .blob {
      position: absolute;
      border-radius: 999px;
      z-index: -1;
      opacity: 0.22;
      filter: blur(2px);
      pointer-events: none;
    }

    .blob.a {
      width: 620px;
      height: 620px;
      right: -240px;
      top: -240px;
      background: radial-gradient(circle, #68e2ab 0%, rgba(104, 226, 171, 0) 72%);
    }

    .blob.b {
      width: 680px;
      height: 680px;
      left: -250px;
      bottom: -300px;
      background: radial-gradient(circle, #95cfb0 0%, rgba(149, 207, 176, 0) 73%);
    }

    .header {
      position: absolute;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 3;
      display: grid;
      place-items: center;
      gap: 16px;
    }

    .fullscreenBtn {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 4;
      border: 1px solid rgba(255, 255, 255, 0.32);
      background: rgba(0, 0, 0, 0.45);
      color: #f3faf6;
      border-radius: 999px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.2px;
      cursor: pointer;
      backdrop-filter: blur(6px);
    }

    .fullscreenBtn:hover {
      background: rgba(0, 0, 0, 0.6);
    }

    :fullscreen .fullscreenBtn {
      opacity: 0;
      pointer-events: none;
    }

    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      text-align: left;
    }

    .logo {
      width: 78px;
      height: 78px;
      border-radius: 22px;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.35);
      background: #fff;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.34);
      flex: 0 0 auto;
    }

    .logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .brandText {
      margin: 0;
      font-size: 13px;
      letter-spacing: 2.1px;
      font-weight: 800;
      color: var(--accent);
      text-transform: uppercase;
      white-space: nowrap;
    }

    .frame {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    .stage {
      width: 100%;
      height: 100%;
      border-radius: 0;
      overflow: hidden;
      position: relative;
      background: radial-gradient(circle at 20% 15%, #1e5f48 0%, #112f25 38%, #071510 100%);
      display: grid;
      place-items: center;
      padding-top: 120px;
      padding-bottom: 24px;
    }

    #slide {
      width: auto;
      height: auto;
      max-width: 96vw;
      max-height: calc(100vh - 170px);
      object-fit: contain;
      object-position: center;
      display: block;
      opacity: 1;
      transform: scale(1);
      transition: opacity 420ms ease, transform 1100ms ease;
      filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.42));
    }

    .enter-fade { opacity: 0; transform: scale(1.06); }
    .enter-slide { opacity: 0; transform: translateX(24px) scale(1.02); }
    .enter-rise { opacity: 0; transform: translateY(18px) scale(1.03); }
    .enter-zoom { opacity: 0; transform: scale(1.11); }

    .stage.is-portrait #slide {
      max-width: 80vw;
      max-height: calc(100vh - 150px);
    }

  </style>
</head>
<body>
  <main class="page">
    <span class="blob a"></span>
    <span class="blob b"></span>
    <button id="fullscreenBtn" class="fullscreenBtn" type="button">Tam Ekran</button>

    <header class="header">
      <div class="brand">
        <div class="logo">
          <img src="/cremore-favicon.jpg" alt="Cremore Logo" />
        </div>
        <p class="brandText">CREMORE COFFEE</p>
      </div>
    </header>

    <section class="frame">
      <div class="stage">
        <img id="slide" alt="Urun gorseli" />
      </div>
    </section>
  </main>

  <script>
    const images = ${JSON.stringify(imagePaths)};
    const cycleMs = 5000;
    const inClasses = ["enter-fade", "enter-slide", "enter-rise", "enter-zoom"];
    const stage = document.querySelector(".stage");
    const slide = document.getElementById("slide");
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    const processedPngCache = new Map();
    let currentIndex = 0;

    function preload(src) {
      const i = new Image();
      i.src = src;
    }

    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    async function getDisplaySource(src) {
      const isPng = /\\.png(?:\\?|#|$)/i.test(src);
      if (!isPng) return src;
      if (processedPngCache.has(src)) return processedPngCache.get(src);

      try {
        const img = await loadImage(src);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return src;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;

        // Remove near-white matte backgrounds for PNG assets.
        let visiblePixelCount = 0;
        const totalPixelCount = canvas.width * canvas.height;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const a = d[i + 3];
          if (a === 0) continue;

          if (r > 248 && g > 248 && b > 248) {
            d[i + 3] = 0;
          } else if (r > 235 && g > 235 && b > 235) {
            const keep = Math.max(0, Math.min(255, (255 - ((r + g + b) / 3 - 235) * 12)));
            d[i + 3] = Math.min(a, keep);
          }

          if (d[i + 3] > 24) visiblePixelCount += 1;
        }

        // If processing makes image nearly invisible, keep original PNG.
        const visibleRatio = totalPixelCount > 0 ? visiblePixelCount / totalPixelCount : 1;
        if (visibleRatio < 0.03) {
          processedPngCache.set(src, src);
          return src;
        }

        ctx.putImageData(imageData, 0, 0);
        const cleaned = canvas.toDataURL("image/png");
        processedPngCache.set(src, cleaned);
        return cleaned;
      } catch {
        return src;
      }
    }

    async function showAt(index) {
      const src = images[index];
      const enter = inClasses[Math.floor(Math.random() * inClasses.length)];
      slide.classList.add(enter);
      const displaySrc = await getDisplaySource(src);
      requestAnimationFrame(() => {
        slide.src = displaySrc;
        requestAnimationFrame(() => {
          slide.classList.remove(enter);
        });
      });
    }

    slide.addEventListener("load", () => {
      const ratio = slide.naturalWidth / slide.naturalHeight;
      if (Number.isFinite(ratio) && ratio < 1) {
        stage.classList.add("is-portrait");
      } else {
        stage.classList.remove("is-portrait");
      }
    });

    slide.addEventListener("error", () => {
      next();
    });

    async function next() {
      currentIndex = (currentIndex + 1) % images.length;
      await showAt(currentIndex);
      const upcoming = (currentIndex + 1) % images.length;
      preload(images[upcoming]);
    }

    async function enterFullscreen() {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        // Tarayici izin vermezse kullanici tekrar butondan deneyebilir.
      }
    }

    fullscreenBtn.addEventListener("click", enterFullscreen);
    document.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "f") enterFullscreen();
    });

    showAt(currentIndex);
    preload(images[(currentIndex + 1) % images.length]);
    setInterval(next, cycleMs);
  </script>
</body>
</html>
`;

fs.writeFileSync(outputPath, html, "utf8");
console.log(`Olusturuldu: ${path.relative(root, outputPath)} (${files.length} gorsel)`);

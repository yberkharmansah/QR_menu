<template>
  <div class="page" :class="{ embedded: embedded }">
    <header class="head">
      <h1>TV HTML Duzenleyici</h1>
      <div class="tabs">
        <button v-for="item in files" :key="item.slug" class="tab" :class="{ active: activeSlug === item.slug }" @click="switchFile(item.slug)">
          {{ item.label }}
        </button>
      </div>
    </header>

    <main class="content">
      <section class="panel">
        <div class="panelHead">
          <strong>{{ currentFile?.label }}</strong>
          <div class="actions">
            <button class="btn" :disabled="saving" @click="resetOverride">Override Sil</button>
            <button class="btn primary" :disabled="saving" @click="saveOverride">{{ saving ? "Kaydediliyor..." : "Kaydet" }}</button>
            <button class="btn" @click="openTvPage">/tv/{{ activeSlug }} Ac</button>
          </div>
        </div>
        <div v-if="notice" class="notice">{{ notice }}</div>

        <template v-if="rows.length > 0">
          <div class="rows">
            <div v-for="row in rows" :key="row.index" class="row">
              <input v-model="row.name" class="input name" />
              <input v-model="row.price" class="input price" />
            </div>
          </div>
        </template>
        <template v-else>
          <textarea v-model="rawHtml" class="raw"></textarea>
        </template>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { clearTvHtmlOverride, loadTvHtml, saveTvHtmlOverride, type TvSlug } from "../services/tvOverrideService";
import { applyCatalogPricesToTvHtml } from "../services/tvCatalogPriceService";

type EditorRow = { index: number; name: string; price: string };

const files: Array<{ slug: TvSlug; label: string; path: string }> = [
  { slug: "items", label: "Items", path: "/exports/menu-tv-items.html" },
  { slug: "icecekler", label: "Icecekler", path: "/exports/menu-tv-icecekler.html" },
  { slug: "yiyecekler", label: "Yiyecekler", path: "/exports/menu-tv-yiyecekler.html" },
];
const props = defineProps<{ embedded?: boolean }>();
const embedded = computed(() => props.embedded ?? false);

const activeSlug = ref<TvSlug>("icecekler");
const htmlMap = reactive<Record<TvSlug, string>>({
  items: "",
  icecekler: "",
  yiyecekler: "",
});
const rows = ref<EditorRow[]>([]);
const rawHtml = ref("");
const saving = ref(false);
const notice = ref("");

const currentFile = computed(() => files.find((f) => f.slug === activeSlug.value));

async function loadFile(slug: TvSlug) {
  const file = files.find((f) => f.slug === slug);
  if (!file) return;
  const loaded = await loadTvHtml(slug, file.path);
  htmlMap[slug] = slug === "items" ? loaded : await applyCatalogPricesToTvHtml(loaded);
  parseCurrent();
}

function parseCurrent() {
  const html = htmlMap[activeSlug.value] || "";
  rawHtml.value = html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const itemRows = Array.from(doc.querySelectorAll(".itemRow"));

  if (itemRows.length === 0) {
    rows.value = [];
    return;
  }

  rows.value = itemRows.map((row, index) => ({
    index,
    name: (row.querySelector(".itemName")?.textContent || "").trim(),
    price: (row.querySelector(".itemPrice")?.textContent || "").trim(),
  }));
}

function buildHtmlFromRows() {
  const baseHtml = htmlMap[activeSlug.value];
  const parser = new DOMParser();
  const doc = parser.parseFromString(baseHtml, "text/html");
  const itemRows = Array.from(doc.querySelectorAll(".itemRow"));

  rows.value.forEach((item) => {
    const row = itemRows[item.index];
    if (!row) return;
    const name = row.querySelector(".itemName");
    const price = row.querySelector(".itemPrice");
    if (name) name.textContent = item.name;
    if (price) price.textContent = item.price;
  });

  return "<!doctype html>\n" + doc.documentElement.outerHTML;
}

async function switchFile(slug: TvSlug) {
  activeSlug.value = slug;
  await loadFile(slug);
}

async function saveOverride() {
  const nextHtml = rows.value.length > 0 ? buildHtmlFromRows() : rawHtml.value;
  htmlMap[activeSlug.value] = nextHtml;
  try {
    saving.value = true;
    await saveTvHtmlOverride(activeSlug.value, nextHtml);
    notice.value = "Kayit tamamlandi (cloud + local).";
  } catch {
    notice.value = "Cloud kaydi basarisiz. Degisiklik bu cihazda local kaydedildi.";
  } finally {
    saving.value = false;
  }
}

async function resetOverride() {
  try {
    saving.value = true;
    await clearTvHtmlOverride(activeSlug.value);
    notice.value = "Override temizlendi.";
  } catch {
    notice.value = "Cloud temizleme basarisiz. Local override temizlendi.";
  } finally {
    saving.value = false;
  }
  await loadFile(activeSlug.value);
}

function openTvPage() {
  window.open(`/#/tv/${activeSlug.value}`, "_blank");
}

loadFile(activeSlug.value);
</script>

<style scoped>
.page {
  min-height: 100dvh;
  background: var(--bg);
  color: var(--text);
  padding: 16px;
  display: grid;
  gap: 12px;
}

.page.embedded {
  min-height: auto;
  background: transparent;
  padding: 0;
}

.head {
  display: grid;
  gap: 8px;
}

.head h1 {
  margin: 0;
  font-size: 20px;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tab {
  border: 1px solid var(--stroke);
  background: var(--card);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
}

.tab.active {
  border-color: #78d6a6;
}

.panel {
  border: 1px solid var(--stroke);
  background: var(--card);
  border-radius: 14px;
  padding: 12px;
  display: grid;
  gap: 10px;
}

.panelHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  border: 1px solid var(--stroke);
  background: var(--input);
  color: var(--text);
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 700;
}

.btn.primary {
  border-color: #7ad6a8;
}

.notice {
  font-size: 13px;
  color: var(--muted);
}

.rows {
  display: grid;
  gap: 8px;
  max-height: 70dvh;
  overflow: auto;
}

.row {
  display: grid;
  grid-template-columns: 1fr 140px;
  gap: 8px;
}

.input,
.raw {
  border: 1px solid var(--stroke);
  background: var(--input);
  color: var(--text);
  border-radius: 10px;
  padding: 10px 12px;
}

.raw {
  min-height: 70dvh;
  resize: vertical;
}

.page.embedded .rows {
  max-height: 58dvh;
}

.page.embedded .raw {
  min-height: 56dvh;
}

@media (max-width: 720px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>

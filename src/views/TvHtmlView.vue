<template>
  <div class="page">
    <iframe v-if="html" class="frame" :srcdoc="html" title="TV HTML Preview" />
    <div v-else class="fallback">TV sayfasi yuklenemedi.</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{ slug: "items" | "icecekler" | "yiyecekler" }>();

const fileMap = {
  items: "/exports/menu-tv-items.html",
  icecekler: "/exports/menu-tv-icecekler.html",
  yiyecekler: "/exports/menu-tv-yiyecekler.html",
} as const;

const html = ref("");

onMounted(async () => {
  const overrideKey = `tvHtmlOverride:${props.slug}`;
  const override = localStorage.getItem(overrideKey);
  if (override) {
    html.value = override;
    return;
  }

  const target = fileMap[props.slug];
  const response = await fetch(target);
  html.value = response.ok ? await response.text() : "";
});
</script>

<style scoped>
.page {
  width: 100vw;
  height: 100dvh;
  background: #000;
}

.frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.fallback {
  min-height: 100%;
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 700;
}
</style>

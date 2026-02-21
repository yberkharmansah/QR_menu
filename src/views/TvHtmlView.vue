<template>
  <div class="page">
    <div v-if="loading" class="fallback">TV sayfasi yukleniyor...</div>
    <iframe v-if="html" class="frame" :srcdoc="html" title="TV HTML Preview" />
    <div v-else-if="!loading" class="fallback">TV sayfasi yuklenemedi.</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { loadTvHtml, type TvSlug } from "../services/tvOverrideService";

const props = defineProps<{ slug: TvSlug }>();

const fileMap = {
  items: "/exports/menu-tv-items.html",
  icecekler: "/exports/menu-tv-icecekler.html",
  yiyecekler: "/exports/menu-tv-yiyecekler.html",
} as const;

const html = ref("");
const loading = ref(true);

onMounted(async () => {
  const target = fileMap[props.slug];
  try {
    html.value = await loadTvHtml(props.slug, target);
  } finally {
    loading.value = false;
  }
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

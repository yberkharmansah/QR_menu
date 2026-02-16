<template>
  <div class="wrap">
    <button class="chip" @click="toggleLocale" :title="t('language')">
      {{ appStore.locale.toUpperCase() }}
    </button>

    <button class="chip" @click="cycleTheme" :title="t('theme')">
      {{ themeBadge }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { appStore, cycleTheme, setLocale, t } from "../store/appStore";

const themeBadge = computed(() => {
  return appStore.theme === "dark" ? "\u{1F319}" : "\u2600\uFE0F";
});

function toggleLocale() {
  setLocale(appStore.locale === "tr" ? "en" : "tr");
}
</script>

<style scoped>
.wrap {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chip {
  height: 34px;
  min-width: 34px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: var(--card);
  color: var(--text);
  cursor: pointer;
  font-weight: 800;
  font-size: 12px;
}
</style>

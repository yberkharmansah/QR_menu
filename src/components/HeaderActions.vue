<template>
  <div class="wrap">
    <button class="chip" @click="toggleLocale" :title="t('language')">
      {{ appStore.locale.toUpperCase() }}
    </button>

    <button class="chip" @click="cycleTheme" :title="t('theme')">
      {{ themeBadge }}
    </button>

    <button class="chip cart" @click="toggleCart(true)" :title="t('cart')">
      {{ t('cart') }}
      <span v-if="cartCount" class="badge">{{ cartCount }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { appStore, cartCount, cycleTheme, setLocale, toggleCart, t } from "../store/appStore";

const themeBadge = computed(() => {
  if (appStore.theme === "forest") return "F1";
  if (appStore.theme === "ivory") return "F2";
  return "F3";
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

.cart {
  position: relative;
  padding: 0 12px;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  height: 18px;
  min-width: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: #fff;
  font-size: 11px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
</style>

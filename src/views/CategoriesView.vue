<template>
  <div class="page">
    <AppHeader title="Kategoriler" :subtitle="t('categories')" :center="true" backTo="/">
  <template #right>
    <HeaderActions />
  </template>
</AppHeader>


    <main class="content">
      <div class="searchWrap">
        <input v-model="q" class="search" :placeholder="t('searchCategory')" />
      </div>

      <div class="grid">
        <CategoryCard
          v-for="c in filtered"
          :key="c.id"
          :title="c.title"
          :description="c.description"
          :emoji="c.emoji"
          @open="openCategory(c.id)"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { appStore, t } from "../store/appStore";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import HeaderActions from "../components/HeaderActions.vue";
import CategoryCard from "../components/CategoryCard.vue";
import { getLocalizedCategories } from "../data/menu";

const router = useRouter();
const q = ref("");
const categories = computed(() => getLocalizedCategories(appStore.locale));

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase();
  if (!s) return categories.value;
  return categories.value.filter((c) => c.title.toLowerCase().includes(s));
});

function openCategory(id: string) {
  router.push(`/categories/${id}`);
}
</script>

<style scoped>
.page { min-height: 100dvh; }
.content { padding: 8px 16px 24px; display: grid; gap: 12px; }
.searchWrap {
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.06);
}
.search {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.20);
  color: rgba(255,255,255,0.92);
  border-radius: 14px;
  padding: 12px 12px;
  outline: none;
}
.search::placeholder { color: rgba(255,255,255,0.55); }
.grid { display: grid; gap: 10px; }
</style>

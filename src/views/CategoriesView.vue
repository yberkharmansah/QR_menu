<template>
  <div class="page">
    <AppHeader :title="t('categories')" :subtitle="t('menu')">
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
          v-for="category in filtered"
          :key="category.id"
          :title="category.title"
          :description="category.description"
          :emoji="category.emoji"
          @open="openCategory(category.id)"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { appStore, t } from "../store/appStore";
import AppHeader from "../components/AppHeader.vue";
import HeaderActions from "../components/HeaderActions.vue";
import CategoryCard from "../components/CategoryCard.vue";
import { getLocalizedCategories } from "../data/menu";

const router = useRouter();
const q = ref("");

const localizedCategories = computed(() => getLocalizedCategories(appStore.locale));

const filtered = computed(() => {
  const search = q.value.trim().toLowerCase();
  if (!search) return localizedCategories.value;

  return localizedCategories.value.filter((category) => {
    return (
      category.title.toLowerCase().includes(search) ||
      category.description.toLowerCase().includes(search)
    );
  });
});

function openCategory(id: string) {
  router.push(`/categories/${id}`);
}
</script>

<style scoped>
.page {
  min-height: 100dvh;
}

.content {
  padding: 8px 16px 24px;
  display: grid;
  gap: 12px;
}

.searchWrap {
  padding: 12px;
  border-radius: 18px;
  border: 1px solid var(--stroke);
  background: var(--card);
}

.search {
  width: 100%;
  border: 1px solid var(--stroke);
  background: var(--input);
  color: var(--text);
  border-radius: 14px;
  padding: 12px 12px;
  outline: none;
}

.search::placeholder {
  color: var(--muted);
}

.grid {
  display: grid;
  gap: 10px;
}
</style>

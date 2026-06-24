<template>
  <div class="page">
    <AppHeader :title="group?.title ?? t('categories')" :subtitle="group?.description" backTo="/categories">
      <template #right>
        <HeaderActions />
      </template>
    </AppHeader>

    <main class="content">
      <div class="searchWrap">
        <input v-model="q" class="search" :placeholder="t('searchCategory')" />
      </div>

      <div v-if="showLoading" class="stateCard">
        {{ t("loadingMenu") }}
      </div>

      <div v-else-if="showFallbackNotice" class="stateCard warning">
        {{ t("showingSavedMenu") }}
      </div>

      <div v-if="showEmptyState" class="stateCard">
        {{ t("noCategoriesFound") }}
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
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { appStore, t } from "../store/appStore";
import AppHeader from "../components/AppHeader.vue";
import HeaderActions from "../components/HeaderActions.vue";
import CategoryCard from "../components/CategoryCard.vue";
import { getLocalizedCategoriesByGroup, getLocalizedGroupById, type MenuGroupId } from "../data/menu";
import { catalogSyncState, forceCatalogRefresh } from "../services/catalogService";

const props = defineProps<{ groupId: MenuGroupId }>();
const router = useRouter();
const q = ref("");

const group = computed(() => getLocalizedGroupById(props.groupId, appStore.locale));
const categories = computed(() => getLocalizedCategoriesByGroup(props.groupId, appStore.locale));
const showLoading = computed(() => !catalogSyncState.categoriesLoaded);
const showFallbackNotice = computed(() => catalogSyncState.categoriesError && categories.value.length > 0);

const filtered = computed(() => {
  const search = q.value.trim().toLowerCase();
  if (!search) return categories.value;

  return categories.value.filter((category) => {
    return category.title.toLowerCase().includes(search) || category.description.toLowerCase().includes(search);
  });
});
const showEmptyState = computed(() => catalogSyncState.categoriesLoaded && filtered.value.length === 0);
const shouldAutoRefresh = computed(() => {
  return (
    showEmptyState.value &&
    !catalogSyncState.categoriesError &&
    !catalogSyncState.isRefreshing &&
    catalogSyncState.source !== "live"
  );
});

function openCategory(categoryId: string) {
  router.push(`/categories/${props.groupId}/${categoryId}`);
}

watch(shouldAutoRefresh, (shouldRefresh) => {
  if (!shouldRefresh) return;
  void forceCatalogRefresh();
}, { immediate: true });
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

.stateCard {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--stroke);
  background: var(--card);
  color: var(--muted);
  text-align: center;
  line-height: 1.45;
}

.warning {
  color: var(--text);
  border-color: rgba(214, 163, 74, 0.45);
  background: rgba(214, 163, 74, 0.12);
}
</style>

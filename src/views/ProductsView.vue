<template>
  <div class="page">
    <AppHeader :title="category?.title ?? t('menu')" :subtitle="category?.description" :backTo="`/categories/${groupId}`">
      <template #right>
        <HeaderActions />
      </template>
    </AppHeader>

    <main class="content">
      <div class="toolbar">
        <input v-model="q" class="search" :placeholder="t('searchProduct')" />
        <button class="pill" @click="sortByPrice = !sortByPrice">
          {{ sortByPrice ? t('sortAsc') : t('sort') }}
        </button>
      </div>

      <div class="list">
        <ProductCard
          v-for="product in filtered"
          :key="product.id"
          :title="product.title"
          :description="product.description"
          :price="product.price"
          :tags="product.tags"
          @open="openProduct(product.id)"
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
import ProductCard from "../components/ProductCard.vue";
import { getLocalizedCategoryById, getLocalizedProductsByCategory } from "../data/menu";

const props = defineProps<{ groupId: string; categoryId: string }>();

const router = useRouter();
const q = ref("");
const sortByPrice = ref(false);

const groupId = computed(() => props.groupId);
const category = computed(() => getLocalizedCategoryById(props.categoryId, appStore.locale));

const filtered = computed(() => {
  const base = getLocalizedProductsByCategory(props.categoryId, appStore.locale);
  const search = q.value.trim().toLowerCase();

  const searched = search
    ? base.filter((product) => {
        return (
          product.title.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search)
        );
      })
    : base;

  if (!sortByPrice.value) return searched;
  return [...searched].sort((a, b) => a.price - b.price);
});

function openProduct(id: string) {
  router.push(`/product/${id}`);
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

.toolbar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
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

.pill {
  border-radius: 999px;
  padding: 10px 12px;
  border: 1px solid var(--stroke);
  background: var(--card);
  color: var(--text);
  cursor: pointer;
  font-weight: 800;
}

.list {
  display: grid;
  gap: 10px;
}
</style>

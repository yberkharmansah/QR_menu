<template>
  <div class="page">
    <AppHeader :title="product?.title ?? t('menu')" :subtitle="product?.description" :backTo="backTo">
      <template #right>
        <HeaderActions />
      </template>
    </AppHeader>

    <main class="content">
      <section class="card">
        <div class="heroImageWrap" :class="{ empty: !product?.imageUrl }">
          <img v-if="product?.imageUrl" :src="product.imageUrl" alt="" class="heroImage" />
        </div>

        <h2 class="name">{{ product?.title ?? "-" }}</h2>
        <p class="description">{{ product?.description ?? "-" }}</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppHeader from "../components/AppHeader.vue";
import HeaderActions from "../components/HeaderActions.vue";
import { getCategoryById, getLocalizedProductById } from "../data/menu";
import { appStore, t } from "../store/appStore";

const props = defineProps<{ productId: string }>();

const product = computed(() => getLocalizedProductById(props.productId, appStore.locale));
const backTo = computed(() => {
  const categoryId = product.value?.categoryId;
  if (!categoryId) return "/categories";

  const category = getCategoryById(categoryId);
  if (!category) return "/categories";
  return `/categories/${category.groupId}/${categoryId}`;
});
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

.card {
  padding: 16px;
  border-radius: 22px;
  border: 1px solid var(--stroke);
  background: var(--card);
  display: grid;
  gap: 12px;
}

.heroImageWrap {
  border-radius: 18px;
  border: 1px solid var(--stroke);
  min-height: 220px;
  padding: 10px;
  background: transparent;
  display: grid;
  place-items: center;
}

.heroImageWrap.empty {
  border-style: dashed;
  opacity: 0.55;
}

.heroImageWrap:not(.empty) {
  overflow: hidden;
}

.heroImage {
  width: 100%;
  height: auto;
  max-height: 420px;
  object-fit: contain;
  object-position: center;
  display: block;
}

.name {
  margin: 0;
  font-size: 22px;
  font-weight: 950;
  color: var(--text);
}

.description {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}
</style>

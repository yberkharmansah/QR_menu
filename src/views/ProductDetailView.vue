<template>
  <div class="page">
    <AppHeader :title="product?.title ?? t('menu')" :subtitle="product?.description" :backTo="backTo">
      <template #right>
        <HeaderActions />
      </template>
    </AppHeader>

    <main class="content">
      <section class="card">
        <div class="row">
          <div class="label">{{ t('price') }}</div>
          <div class="value">{{ product?.price ?? '-' }} TL</div>
        </div>

        <div class="row" v-if="product?.tags?.length">
          <div class="label">{{ t('tags') }}</div>
          <div class="tags">
            <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="divider" />

        <UiButton variant="primary" @click="add">{{ t('addToCart') }}</UiButton>
        <UiButton variant="ghost" @click="goBack">{{ t('back') }}</UiButton>
      </section>

      <div v-if="toast" class="toast">{{ toast }}</div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import HeaderActions from "../components/HeaderActions.vue";
import UiButton from "../components/UiButton.vue";
import { getCategoryById, getLocalizedProductById } from "../data/menu";
import { addToCart, appStore, t } from "../store/appStore";

const props = defineProps<{ productId: string }>();
const router = useRouter();

const product = computed(() => getLocalizedProductById(props.productId, appStore.locale));
const backTo = computed(() => {
  const categoryId = product.value?.categoryId;
  if (!categoryId) return "/categories";

  const category = getCategoryById(categoryId);
  if (!category) return "/categories";
  return `/categories/${category.groupId}/${categoryId}`;
});

const toast = ref("");

function add() {
  if (!product.value) return;
  addToCart(product.value.id, 1);
  toast.value = t("addedDemo");
  setTimeout(() => {
    toast.value = "";
  }, 1400);
}

function goBack() {
  router.push(backTo.value);
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

.card {
  padding: 16px;
  border-radius: 22px;
  border: 1px solid var(--stroke);
  background: var(--card);
  display: grid;
  gap: 12px;
}

.row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px;
  align-items: start;
}

.label {
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
}

.value {
  font-size: 16px;
  font-weight: 950;
  color: var(--text);
}

.divider {
  height: 1px;
  background: var(--stroke);
  margin: 6px 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: var(--input);
  color: var(--text);
}

.toast {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 18px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid var(--stroke);
  background: rgba(0, 0, 0, 0.45);
  color: var(--text);
  backdrop-filter: blur(10px);
}
</style>

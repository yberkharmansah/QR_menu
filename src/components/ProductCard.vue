<template>
  <button class="card" @click="$emit('open')">
    <div class="thumbWrap" :class="{ empty: !imageUrl }">
      <img v-if="imageUrl" :src="imageUrl" alt="" class="thumb" />
    </div>

    <div class="left">
      <div class="titleRow">
        <div class="title">{{ title }}</div>
        <div class="price">{{ price }} TL</div>
      </div>

      <div class="desc">{{ description }}</div>

      <div v-if="tags?.length" class="tags">
        <span v-for="t in tags" :key="t" class="tag">{{ t }}</span>
      </div>
    </div>

    <div class="chev">&gt;</div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  tags?: string[];
}>();

defineEmits<{
  (e: "open"): void;
}>();
</script>

<style scoped>
.card {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr 20px;
  gap: 12px;
  align-items: center;
  text-align: left;
  padding: 14px 14px;
  border-radius: 18px;
  border: 1px solid var(--stroke);
  background: var(--card);
  color: var(--text);
  cursor: pointer;
}

.thumbWrap {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  border: 1px solid var(--stroke);
  overflow: hidden;
}

.thumbWrap.empty {
  border-style: dashed;
  background: transparent;
  opacity: 0.55;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.titleRow {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: baseline;
}

.title {
  font-weight: 900;
  font-size: 14px;
}

.price {
  font-weight: 900;
  opacity: 0.9;
}

.desc {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
}

.tags {
  margin-top: 10px;
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

.chev {
  font-size: 22px;
  opacity: 0.8;
}
</style>

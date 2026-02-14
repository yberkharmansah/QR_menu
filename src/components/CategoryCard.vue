<template>
  <button class="card" @click="$emit('open')">
    <div class="emoji">{{ emoji }}</div>
    <div class="content">
      <div class="title">{{ title }}</div>
      <div class="desc">{{ description }}</div>
    </div>
    <div class="chev">&gt;</div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  emoji: string;
}>();

defineEmits<{
  (e: "open"): void;
}>();
</script>

<style scoped>
.card {
  width: 100%;
  display: grid;
  grid-template-columns: 48px 1fr 20px;
  gap: 12px;
  align-items: center;
  text-align: left;
  padding: 14px 14px;
  border-radius: 18px;
  border: 1px solid var(--stroke);
  background: var(--card);
  color: var(--text);
  cursor: pointer;
  transition: transform 0.08s ease, background 0.2s ease;
}

.card:active {
  transform: translateY(1px);
}

.emoji {
  height: 48px;
  width: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(31, 111, 74, 0.2);
  border: 1px solid var(--stroke);
  font-size: 22px;
}

.title {
  font-weight: 900;
  font-size: 14px;
}

.desc {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
}

.chev {
  font-size: 22px;
  opacity: 0.8;
}
</style>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps<{
  title: string;
  subtitle?: string;
  backTo?: string;
  center?: boolean;
}>();

const router = useRouter();

function goBack() {
  if (props.backTo) router.push(props.backTo);
}
</script>

<template>
  <header class="header" :class="{ center }">
    <button v-if="backTo" class="back" @click="goBack" aria-label="Back">
      {{ '<' }}
    </button>
    <div v-else class="spacer" />

    <div class="titleWrap">
      <div class="title">{{ title }}</div>
      <div v-if="subtitle" class="subtitle">{{ subtitle }}</div>
    </div>

    <div class="rightSlot">
      <slot name="right" />
    </div>
  </header>
</template>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 10px;
}

.spacer {
  height: 40px;
  width: 40px;
}

.center .titleWrap {
  text-align: center;
  justify-self: center;
}

.back {
  height: 40px;
  width: 40px;
  border-radius: 12px;
  border: 1px solid var(--stroke);
  background: var(--card);
  color: var(--text);
  cursor: pointer;
  font-weight: 900;
}

.titleWrap {
  min-width: 0;
}

.title {
  font-weight: 900;
  font-size: 18px;
  line-height: 1.15;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtitle {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

.rightSlot {
  display: flex;
  justify-content: flex-end;
}
</style>

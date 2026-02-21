<template>
  <div class="redirectWrap">
    <p>TV sayfasi aciliyor...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const props = defineProps<{ target: string }>();

onMounted(() => {
  window.location.replace(props.target);
});
</script>

<style scoped>
.redirectWrap {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  color: var(--text);
  background: var(--bg);
  font-weight: 700;
}
</style>

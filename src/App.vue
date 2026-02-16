<template>
  <div class="appShell">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { appStore, setTheme } from "./store/appStore";

// Ilk yuklemede tema uygula
setTheme(appStore.theme);
</script>

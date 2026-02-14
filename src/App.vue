<template>
  <div class="appShell">
    <router-view />
    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
import CartDrawer from "./components/CartDrawer.vue";
import { appStore, setTheme } from "./store/appStore";

// İlk yüklemede tema uygula
setTheme(appStore.theme);
</script>

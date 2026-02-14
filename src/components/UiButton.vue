<template>
  <button
    class="btn"
    :class="{
      primary: variant === 'primary',
      ghost: variant === 'ghost',
    }"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "ghost";
    type?: "button" | "submit";
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    type: "button",
    disabled: false,
  }
);
</script>

<style scoped>
.btn {
  width: 100%;
  border: 0;
  border-radius: 14px;
  padding: 12px 14px;
  font-weight: 700;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: transform 0.05s ease, opacity 0.2s ease;
}

.btn:active {
  transform: translateY(1px);
}

.primary {
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: #fff;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.28);
  border: 1px solid var(--stroke);
}

.ghost {
  background: var(--card);
  color: var(--text);
  border: 1px solid var(--stroke);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

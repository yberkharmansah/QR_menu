<template>
  <div v-if="appStore.cartOpen" class="overlay" @click.self="toggleCart(false)">
    <div class="sheet">
      <div class="top">
        <div class="title">{{ t('cart') }}</div>
        <button class="x" @click="toggleCart(false)">{{ t('close') }}</button>
      </div>

      <div v-if="!cartLines.length" class="empty">
        {{ t('emptyCart') }}
      </div>

      <div v-else class="list">
        <div v-for="line in cartLines" :key="line.productId" class="row">
          <div class="info">
            <div class="name">{{ line.title }}</div>
            <div class="sub">{{ line.price }} TL | {{ t('qty') }}: {{ line.qty }}</div>
          </div>

          <div class="stepper">
            <button class="btn" @click="dec(line.productId)">-</button>
            <div class="qty">{{ line.qty }}</div>
            <button class="btn" @click="inc(line.productId)">+</button>
          </div>
        </div>
      </div>

      <div class="bottom">
        <div class="total">
          <div class="label">{{ t('total') }}</div>
          <div class="value">{{ cartTotal }} TL</div>
        </div>

        <div class="actions">
          <button class="ghost" @click="clearCart">{{ t('clear') }}</button>
          <button class="primary" @click="toggleCart(false)">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appStore, cartLines, cartTotal, toggleCart, inc, dec, clearCart, t } from "../store/appStore";
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 12px;
  z-index: 50;
}

.sheet {
  width: 100%;
  max-width: 480px;
  border-radius: 22px;
  border: 1px solid var(--stroke);
  background: var(--card);
  color: var(--text);
  overflow: hidden;
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.35);
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 14px 10px;
}

.title {
  font-weight: 950;
  font-size: 16px;
}

.x {
  border-radius: 12px;
  border: 1px solid var(--stroke);
  background: transparent;
  color: var(--text);
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 900;
}

.empty {
  padding: 18px 14px;
  color: var(--muted);
}

.list {
  max-height: 45vh;
  overflow: auto;
  padding: 0 10px 10px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid var(--stroke);
  background: var(--card);
  margin: 10px 4px 0;
}

.name {
  font-weight: 900;
}

.sub {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn {
  height: 34px;
  width: 34px;
  border-radius: 12px;
  border: 1px solid var(--stroke);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  font-size: 18px;
}

.qty {
  min-width: 18px;
  text-align: center;
  font-weight: 900;
}

.bottom {
  border-top: 1px solid var(--stroke);
  padding: 12px 14px calc(14px + env(safe-area-inset-bottom));
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.label {
  color: var(--muted);
  font-weight: 800;
  font-size: 12px;
}

.value {
  font-weight: 950;
  font-size: 18px;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;
}

.primary,
.ghost {
  border-radius: 14px;
  padding: 12px 12px;
  font-weight: 900;
  cursor: pointer;
  border: 1px solid var(--stroke);
}

.primary {
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: #fff;
}

.ghost {
  background: transparent;
  color: var(--text);
}
</style>

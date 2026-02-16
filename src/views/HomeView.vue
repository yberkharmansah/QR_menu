<template>
  <div class="page">
    <AppHeader title="Cremore" :subtitle="t('menu')" :center="true">
      <template #right>
        <HeaderActions />
      </template>
    </AppHeader>

    <main class="content">
      <section class="hero">
        <div class="brandMark">
          <img :src="logoUrl" alt="Cremore Coffee Logo" class="logoImg" />
        </div>

        <div class="heroText">
          <div class="brandName">cremore</div>
          <div class="brandSub">coffee</div>
          <p>{{ t('welcome') }}</p>
        </div>
      </section>

      <div class="socialPanel">
        <div class="socialTitle">{{ t("socialAccounts") }}</div>
        <div class="socials">
          <a
            class="socialLink"
            href="https://www.instagram.com/cremorecoffee/"
            aria-label="Instagram"
            @click.prevent="openInstagram"
          >
            <svg viewBox="0 0 24 24" class="socialSvg" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5.5" ry="5.5" />
              <circle cx="12" cy="12" r="4.1" />
              <circle cx="17.3" cy="6.8" r="1.1" />
            </svg>
          </a>
          <a
            class="socialLink"
            href="https://maps.app.goo.gl/JLmKKqqZGSRHe8r7A"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Google Maps"
          >
            <svg viewBox="0 0 24 24" class="socialSvg" aria-hidden="true">
              <path d="M12 21c-3.9-4.6-6-7.5-6-10a6 6 0 1 1 12 0c0 2.5-2.1 5.4-6 10z" />
              <circle cx="12" cy="11" r="2.2" />
            </svg>
          </a>
        </div>
      </div>

      <div class="actions">
        <UiButton @click="goMenu" :disabled="isTransitioning">{{ t('menu') }}</UiButton>
      </div>
    </main>

    <div v-if="isTransitioning" class="menuTransition" aria-hidden="true">
      <div class="menuGlow" />
      <div class="beanSpinner">
        <img :src="beanSplitIcon" alt="" class="beanIcon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import HeaderActions from "../components/HeaderActions.vue";
import UiButton from "../components/UiButton.vue";
import logoUrl from "../assets/cremore-logo.jpg";
import beanSplitIcon from "../assets/coffee-bean-split.svg";
import { t } from "../store/appStore";

const router = useRouter();
const isTransitioning = ref(false);
let navigateTimer: ReturnType<typeof setTimeout> | null = null;
const transitionMs = 950;

function goMenu() {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  navigateTimer = setTimeout(() => {
    router.push("/categories");
  }, transitionMs);
}

function openInstagram() {
  const username = "cremorecoffee";
  const appUrl = `instagram://user?username=${username}`;
  const webUrl = `https://www.instagram.com/${username}/`;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!isMobile) {
    window.open(webUrl, "_blank", "noopener,noreferrer");
    return;
  }

  let didHide = false;
  const clear = () => {
    window.removeEventListener("pagehide", onHide);
    window.removeEventListener("blur", onHide);
  };
  const onHide = () => {
    didHide = true;
    clear();
  };

  window.addEventListener("pagehide", onHide, { once: true });
  window.addEventListener("blur", onHide, { once: true });

  setTimeout(() => {
    clear();
    if (!didHide) {
      window.location.href = webUrl;
    }
  }, 1100);

  window.location.href = appUrl;
}

onBeforeUnmount(() => {
  if (navigateTimer) clearTimeout(navigateTimer);
});
</script>

<style scoped>
.page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 12px 16px calc(18px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hero {
  margin-top: 6px;
  padding: 22px 18px;
  border-radius: 22px;
  border: 1px solid var(--stroke);
  background: var(--card);
  text-align: center;
}

.brandMark {
  width: 108px;
  height: 108px;
  margin: 0 auto;
  border-radius: 28px;
  display: grid;
  place-items: center;
  background: var(--card);
  border: 1px solid var(--stroke);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.logoImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.heroText {
  margin-top: 16px;
}

.brandName {
  font-weight: 950;
  font-size: 30px;
  letter-spacing: 0.2px;
  color: var(--text);
  line-height: 1.05;
  text-transform: lowercase;
}

.brandSub {
  display: inline-block;
  margin-top: 10px;
  font-weight: 900;
  font-size: 16px;
  letter-spacing: 0.6px;
  color: var(--text);
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: rgba(31, 111, 74, 0.2);
}

.heroText p {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
}

.actions {
  margin-top: auto;
  display: grid;
  gap: 10px;
  padding-top: 4px;
}

.socialPanel {
  border: 1px solid var(--stroke);
  border-radius: 16px;
  background: var(--card);
  padding: 10px 12px;
  display: grid;
  gap: 10px;
}

.socialTitle {
  margin: 0;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.4px;
  color: var(--muted);
}

.socials {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
}

.socialLink {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  border: 1px solid var(--stroke);
  background: var(--card);
  color: var(--text);
  text-decoration: none;
  transition: transform 150ms ease, background 150ms ease, border-color 150ms ease;
}

.socialLink:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.12);
}

.socialSvg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.menuTransition {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  pointer-events: none;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.58));
  animation: sceneFade 950ms ease-out forwards;
}

.menuGlow {
  position: absolute;
  height: 84px;
  width: 84px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  filter: blur(4px);
  animation: glowPulse 950ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.beanSpinner {
  position: relative;
  height: 106px;
  width: 106px;
  display: grid;
  place-items: center;
  animation: beanSpin 950ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.beanIcon {
  height: 100%;
  width: 100%;
  filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.45));
  animation: beanRise 950ms ease-out forwards;
}

@keyframes sceneFade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes glowPulse {
  0% {
    transform: scale(0.2);
    opacity: 0.25;
  }
  70% {
    transform: scale(8.5);
    opacity: 0.9;
  }
  100% {
    transform: scale(11);
    opacity: 1;
  }
}

@keyframes beanSpin {
  0% {
    transform: rotate(-70deg) scale(0.45);
    opacity: 0;
  }
  60% {
    transform: rotate(220deg) scale(1.02);
    opacity: 1;
  }
  100% {
    transform: rotate(320deg) scale(1);
    opacity: 1;
  }
}

@keyframes beanRise {
  0% {
    transform: translateY(16px);
    opacity: 0;
  }
  55% {
    transform: translateY(-2px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-height: 700px) {
  .brandMark {
    width: 96px;
    height: 96px;
  }

  .brandName {
    font-size: 26px;
  }

  .hero {
    padding: 18px 16px;
  }
}
</style>

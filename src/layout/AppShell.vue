<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import logoLight from '@/assets/logos/bakano-light.png'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="shell">
    <header class="shell__topbar">
      <button class="shell__burger" @click="sidebarOpen = !sidebarOpen" aria-label="Menú">
        <i class="fa-solid fa-bars"></i>
      </button>
      <img :src="logoLight" alt="Bakano" class="shell__topbar-logo" />
      <span class="shell__topbar-name">Replay</span>
    </header>

    <Transition name="scrim">
      <div v-if="sidebarOpen" class="shell__scrim" @click="sidebarOpen = false"></div>
    </Transition>

    <AppSidebar :open="sidebarOpen" @navigate="sidebarOpen = false" />

    <main class="shell__content">
      <RouterView v-slot="{ Component, route }">
        <Transition name="view" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped lang="scss">
.shell {
  display: flex;
  min-height: 100vh;
  background: $primary-light;

  &__topbar {
    display: none;
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0;
  }

  &__scrim {
    display: none;
  }
}

/* Transición entre vistas */
.view-enter-active,
.view-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.view-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.view-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.scrim-enter-active,
.scrim-leave-active {
  transition: opacity 0.2s ease;
}

.scrim-enter-from,
.scrim-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .view-enter-active,
  .view-leave-active {
    transition: none !important;
  }
}

@media (max-width: 860px) {
  .shell {
    flex-direction: column;

    &__topbar {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      background: $primary-dark;
      padding: 0.8rem 1.1rem;
      position: sticky;
      top: 0;
      z-index: 30;
    }

    &__topbar-logo {
      height: 22px;
      width: auto;
    }

    &__topbar-name {
      color: $primary;
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    &__burger {
      background: none;
      border: none;
      color: $text-light;
      font-size: 1.1rem;
      padding: 0.3rem 0.4rem;
    }

    &__scrim {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba($primary-dark, 0.55);
      z-index: 40;
    }
  }
}
</style>

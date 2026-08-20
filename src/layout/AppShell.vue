<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import logoLight from '@/assets/logos/bakano-light.png'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const tabs = [
  { to: '/', icon: 'fa-solid fa-wand-magic-sparkles', label: 'Crear' },
  { to: '/videos', icon: 'fa-solid fa-film', label: 'Videos' },
  { to: '/recursos', icon: 'fa-solid fa-box-archive', label: 'Recursos' },
  { to: '/gastos', icon: 'fa-solid fa-coins', label: 'Gastos' },
  { to: '/usuarios', icon: 'fa-solid fa-users', label: 'Equipo' },
]

function logout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="shell">
    <header class="shell__topbar">
      <img :src="logoLight" alt="Bakano" class="shell__topbar-logo" />
      <span class="shell__topbar-name">Replay</span>
      <button class="shell__logout" @click="logout" aria-label="Cerrar sesión">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </header>

    <AppSidebar :open="false" />

    <main class="shell__content">
      <RouterView v-slot="{ Component, route }">
        <Transition name="view" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <nav class="shell__tabbar">
      <router-link
        v-for="t in tabs"
        :key="t.to"
        :to="t.to"
        class="shell__tab"
        exact-active-class="is-active"
      >
        <i :class="t.icon"></i>
        <span>{{ t.label }}</span>
      </router-link>
    </nav>
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

  &__tabbar {
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
      gap: 0.7rem;
      background: $primary-dark;
      padding: 0.75rem 1.1rem;
      padding-top: calc(0.75rem + env(safe-area-inset-top));
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

    &__logout {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: auto;
      width: 44px;
      height: 44px;
      background: none;
      border: none;
      color: rgba($text-light, 0.75);
      font-size: 1rem;
    }

    &__content {
      padding-bottom: calc(64px + env(safe-area-inset-bottom));
    }

    /* Barra de pestañas inferior — navegación principal en móvil */
    &__tabbar {
      display: flex;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 40;
      background: $primary-dark;
      border-top: 1px solid rgba($white, 0.08);
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
}

.shell__tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  flex: 1;
  min-height: 56px;
  color: rgba($text-light, 0.55);
  text-decoration: none;
  font-size: 0.62rem;
  font-weight: 700;

  i {
    font-size: 1.05rem;
  }

  &.is-active {
    color: $primary;
  }
}

@media (min-width: 861px) {
  .shell__logout {
    display: none;
  }
}
</style>

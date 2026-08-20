<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import logoLight from '@/assets/logos/bakano-light.png'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'navigate'): void }>()

const router = useRouter()
const userStore = useUserStore()

const navItems = [
  { to: '/', icon: 'fa-solid fa-wand-magic-sparkles', label: 'Generador' },
  { to: '/videos', icon: 'fa-solid fa-film', label: 'Mis videos' },
  { to: '/recursos', icon: 'fa-solid fa-box-archive', label: 'Recursos' },
  { to: '/gastos', icon: 'fa-solid fa-coins', label: 'Gastos' },
  { to: '/usuarios', icon: 'fa-solid fa-users', label: 'Usuarios' },
]

function logout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar" :class="{ 'is-open': open }">
    <div class="sidebar__brand">
      <img :src="logoLight" alt="Bakano" />
      <span class="sidebar__product"><i class="fa-solid fa-clapperboard"></i> Replay</span>
    </div>

    <nav class="sidebar__nav">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="sidebar__nav-item"
        exact-active-class="is-active"
        @click="emit('navigate')"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar__footer">
      <div class="sidebar__user">
        <span class="sidebar__avatar"><i class="fa-solid fa-user"></i></span>
        <span class="sidebar__user-info">
          <strong>{{ userStore.user?.name || 'Usuario' }}</strong>
          <small>{{ userStore.user?.email }}</small>
        </span>
      </div>
      <button class="sidebar__logout" @click="logout">
        <i class="fa-solid fa-right-from-bracket"></i>
        Cerrar sesión
      </button>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  width: 248px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  background: $primary-dark;
  padding: 1.4rem 1rem;
  gap: 1.6rem;

  &__brand {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.55rem;
    padding: 0 0.5rem;

    img {
      height: 24px;
      width: auto;
      max-width: 100%;
    }
  }

  &__product {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: $primary;
    background: rgba($primary, 0.14);
    font-weight: 800;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.28rem 0.7rem;
    border-radius: 999px;

    i {
      font-size: 0.62rem;
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  &__nav-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: rgba($text-light, 0.65);
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 600;
    padding: 0.7rem 0.9rem;
    border-radius: 12px;
    transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;

    i {
      width: 18px;
      text-align: center;
      font-size: 0.95rem;
    }

    &:hover {
      color: $text-light;
      background: rgba($white, 0.06);
      transform: translateX(2px);
    }

    &.is-active {
      color: $text-light;
      background: linear-gradient(90deg, rgba($primary, 0.35), rgba($primary, 0.12));
      box-shadow: inset 3px 0 0 $primary;
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    margin-top: auto;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    background: rgba($white, 0.05);
    border-radius: 14px;
    padding: 0.7rem 0.8rem;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba($primary, 0.25);
    color: $primary;
    flex-shrink: 0;
    font-size: 0.85rem;
  }

  &__user-info {
    display: flex;
    flex-direction: column;
    min-width: 0;

    strong {
      color: $text-light;
      font-size: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    small {
      color: rgba($text-light, 0.5);
      font-size: 0.68rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__logout {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: $font-principal;
    font-size: 0.8rem;
    font-weight: 700;
    color: rgba($text-light, 0.8);
    background: none;
    border: 1px solid rgba($white, 0.12);
    border-radius: 12px;
    padding: 0.6rem;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover {
      background: rgba($primary, 0.3);
      color: $text-light;
    }
  }
}

@media (max-width: 860px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: 8px 0 30px rgba($primary-dark, 0.4);

    &.is-open {
      transform: translateX(0);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .sidebar {
    transition: none !important;
  }
}
</style>

<script setup lang="ts">
defineProps<{
  open: boolean
  icon: string
  color: string
  eyebrow: string
  title: string
}>()

const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <Transition name="drawer">
    <aside v-if="open" class="drawer" @pointerdown.stop>
      <header class="drawer__head">
        <span class="drawer__icon" :class="`is-${color}`"><i :class="icon"></i></span>
        <span class="drawer__titles">
          <small>{{ eyebrow }}</small>
          <strong>{{ title }}</strong>
        </span>
        <button class="drawer__close" @click="emit('close')" aria-label="Cerrar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <div class="drawer__content">
        <slot />
      </div>

      <footer class="drawer__foot">
        <button class="drawer__done" @click="emit('close')">
          <i class="fa-solid fa-check"></i> Listo
        </button>
      </footer>
    </aside>
  </Transition>
</template>

<style scoped lang="scss">
.drawer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(430px, 92vw);
  display: flex;
  flex-direction: column;
  background: $white;
  border-left: 1px solid rgba($primary-dark, 0.1);
  box-shadow: -18px 0 40px rgba($primary-dark, 0.18);
  z-index: 10;
  border-radius: 0 18px 18px 0;

  &__head {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 1.1rem 1.2rem;
    border-bottom: 1px solid rgba($primary-dark, 0.08);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    color: $white;
    font-size: 0.95rem;
    flex-shrink: 0;

    &.is-green { background: $BAKANO-GREEN; }
    &.is-blue { background: $alert-info; }
    &.is-purple { background: $secondary; }
    &.is-pink { background: $primary; }
  }

  &__titles {
    display: flex;
    flex-direction: column;
    min-width: 0;

    small {
      font-size: 0.62rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: $text-secondary;
    }

    strong {
      font-size: 0.95rem;
      font-weight: 800;
      color: $primary-dark;
    }
  }

  &__close {
    margin-left: auto;
    background: none;
    border: none;
    color: $text-secondary;
    font-size: 1.05rem;
    padding: 0.4rem 0.5rem;

    &:hover {
      color: $primary;
    }
  }

  &__content {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 1.1rem 1.2rem;
  }

  &__foot {
    display: flex;
    padding: 0.9rem 1.2rem;
    border-top: 1px solid rgba($primary-dark, 0.08);
  }

  &__done {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex: 1;
    font-family: $font-principal;
    font-size: 0.88rem;
    font-weight: 800;
    color: $white;
    background: $primary;
    border: none;
    border-radius: 12px;
    padding: 0.75rem;

    &:hover {
      background: darken($primary, 8);
    }
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .drawer-enter-active,
  .drawer-leave-active {
    transition: none !important;
  }
}
</style>

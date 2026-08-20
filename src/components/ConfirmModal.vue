<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useConfirm } from '@/composables/useConfirm'

const { state, settle } = useConfirm()

function onKey(e: KeyboardEvent) {
  if (!state.open) return
  if (e.key === 'Escape') settle(false)
  if (e.key === 'Enter') settle(true)
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="cscrim">
      <div v-if="state.open" class="cmodal-scrim" @click="settle(false)"></div>
    </Transition>

    <Transition name="ccard">
      <div v-if="state.open" class="cmodal" role="dialog" aria-modal="true">
        <span class="cmodal__icon" :class="{ 'is-danger': state.danger }">
          <i :class="state.icon"></i>
        </span>

        <h3 class="cmodal__title">{{ state.title }}</h3>
        <p class="cmodal__message">{{ state.message }}</p>

        <div class="cmodal__actions">
          <button class="cmodal__btn cmodal__btn--ghost" @click="settle(false)">
            {{ state.cancelLabel }}
          </button>
          <button
            class="cmodal__btn"
            :class="state.danger ? 'cmodal__btn--danger' : 'cmodal__btn--primary'"
            @click="settle(true)"
          >
            {{ state.confirmLabel }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.cmodal-scrim {
  position: fixed;
  inset: 0;
  background: rgba($primary-dark, 0.55);
  backdrop-filter: blur(3px);
  z-index: 90;
}

.cmodal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  width: min(400px, calc(100vw - 2.5rem));
  background: $white;
  border-radius: 20px;
  padding: 1.8rem 1.6rem 1.4rem;
  box-shadow: 0 24px 60px rgba($primary-dark, 0.35);
  z-index: 91;
  text-align: center;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 16px;
    font-size: 1.3rem;
    color: $primary;
    background: rgba($primary, 0.1);

    &.is-danger {
      color: $alert-error;
      background: $alert-error-bg;
    }
  }

  &__title {
    font-size: 1.05rem;
    font-weight: 800;
    color: $primary-dark;
  }

  &__message {
    font-size: 0.85rem;
    color: $text-secondary;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    gap: 0.7rem;
    width: 100%;
    margin-top: 0.6rem;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    font-family: $font-principal;
    font-size: 0.88rem;
    font-weight: 800;
    border: none;
    border-radius: 12px;
    padding: 0.75rem;
    transition: background 0.15s ease, transform 0.1s ease;

    &:active {
      transform: scale(0.98);
    }

    &--ghost {
      color: $primary-dark;
      background: rgba($primary-dark, 0.07);

      &:hover {
        background: rgba($primary-dark, 0.12);
      }
    }

    &--primary {
      color: $white;
      background: $primary;

      &:hover {
        background: darken($primary, 8);
      }
    }

    &--danger {
      color: $white;
      background: $alert-error;

      &:hover {
        background: darken($alert-error, 8);
      }
    }
  }
}

/* Transiciones de entrada y salida */
.cscrim-enter-active,
.cscrim-leave-active {
  transition: opacity 0.22s ease;
}

.cscrim-enter-from,
.cscrim-leave-to {
  opacity: 0;
}

.ccard-enter-active {
  transition: opacity 0.24s ease, transform 0.24s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.ccard-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.ccard-enter-from {
  opacity: 0;
  transform: translate(-50%, -46%) scale(0.92);
}

.ccard-leave-to {
  opacity: 0;
  transform: translate(-50%, -52%) scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .cscrim-enter-active,
  .cscrim-leave-active,
  .ccard-enter-active,
  .ccard-leave-active {
    transition: none !important;
  }
}
</style>

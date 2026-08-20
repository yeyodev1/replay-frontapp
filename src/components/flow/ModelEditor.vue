<script setup lang="ts">
import { useVideoFlow } from '@/composables/useVideoFlow'

const flow = useVideoFlow()

const tierLabels: Record<string, string> = {
  economico: 'Económico',
  equilibrado: 'Equilibrado',
  audio: 'Con audio',
  premium: 'Premium',
}
</script>

<template>
  <div class="editor-body">
    <div class="model-list">
      <button
        v-for="m in flow.catalog.value?.models"
        :key="m.id"
        type="button"
        class="model-row"
        :class="{ 'is-selected': m.id === flow.modelId.value }"
        @click="flow.selectModel(m)"
      >
        <span class="model-row__radio"></span>
        <span class="model-row__main">
          <span class="model-row__name">
            {{ m.name }}
            <em :class="`tier-${m.tier}`">{{ tierLabels[m.tier] }}</em>
          </span>
          <span class="model-row__tag">{{ m.tagline }}</span>
        </span>
        <span class="model-row__meta">
          <i v-if="m.hasAudio" class="fa-solid fa-volume-high" title="Genera audio"></i>
          <i v-if="m.requiresImage" class="fa-solid fa-image" title="Requiere imagen inicial"></i>
          <strong>${{ Math.min(...Object.values(m.pricePerSecond)).toFixed(3) }}/s</strong>
        </span>
      </button>
    </div>

    <ul v-if="flow.selectedModel.value" class="model-facts">
      <li v-for="f in flow.selectedModel.value.features" :key="f">
        <i class="fa-solid fa-check"></i>{{ f }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.editor-body {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.model-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.model-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: $font-principal;
  text-align: left;
  background: $white;
  border: 1.5px solid rgba($primary-dark, 0.1);
  border-radius: 12px;
  padding: 0.65rem 0.85rem;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: rgba($primary, 0.45);
  }

  &.is-selected {
    border-color: $primary;
    background: rgba($primary, 0.04);

    .model-row__radio {
      border-color: $primary;

      &::after {
        transform: scale(1);
      }
    }
  }

  &__radio {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba($primary-dark, 0.3);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $primary;
      transform: scale(0);
      transition: transform 0.15s ease;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
    flex: 1 1 auto;
  }

  &__name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    font-weight: 800;
    color: $primary-dark;

    em {
      font-style: normal;
      font-size: 0.58rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 0.14rem 0.45rem;
      border-radius: 999px;

      &.tier-economico { color: $alert-success; background: $alert-success-bg; }
      &.tier-equilibrado { color: $alert-info; background: $alert-info-bg; }
      &.tier-audio { color: $secondary-dark; background: $overlay-purple; }
      &.tier-premium { color: $primary; background: rgba($primary, 0.1); }
    }
  }

  &__tag {
    font-size: 0.7rem;
    color: $text-secondary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    flex-shrink: 0;

    i {
      color: $secondary-dark;
      font-size: 0.75rem;
    }

    strong {
      font-size: 0.78rem;
      font-weight: 800;
      color: $primary;
    }
  }
}

.model-facts {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  list-style: none;
  background: rgba($BAKANO-GREEN, 0.06);
  border-radius: 10px;
  padding: 0.7rem 0.9rem;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.74rem;
    color: $primary-dark;
    line-height: 1.4;

    i {
      color: $BAKANO-GREEN;
      font-size: 0.65rem;
      margin-top: 0.2rem;
    }
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import type { SpendStats } from '@/types/video'

const props = defineProps<{ byModel: SpendStats['byModel'] }>()

const maxSpend = computed(() =>
  Math.max(...props.byModel.map((m) => m.spentUsd), 0.0001),
)
</script>

<template>
  <section class="panel">
    <h2><i class="fa-solid fa-layer-group"></i> Gasto por modelo</h2>
    <p v-if="!byModel.length" class="panel__empty">Aún no hay gasto registrado.</p>
    <div class="bars">
      <div v-for="m in byModel" :key="m.model" class="bar-row">
        <div class="bar-row__top">
          <strong>{{ m.name }}</strong>
          <span>{{ m.count }} video{{ m.count === 1 ? '' : 's' }} · {{ m.seconds }}s</span>
          <em>${{ m.spentUsd.toFixed(3) }}</em>
        </div>
        <div class="bar-row__track">
          <div class="bar-row__fill" :style="{ width: `${(m.spentUsd / maxSpend) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/components/spend/spendPanel.scss' as *;

.bars {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.bar-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  &__top {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;

    strong {
      font-size: 0.84rem;
      color: $primary-dark;
    }

    span {
      font-size: 0.7rem;
      color: $text-secondary;
    }

    em {
      margin-left: auto;
      font-style: normal;
      font-size: 0.84rem;
      font-weight: 800;
      color: $primary;
    }
  }

  &__track {
    display: flex;
    height: 8px;
    border-radius: 999px;
    background: rgba($primary-dark, 0.06);
    overflow: hidden;
  }

  &__fill {
    background: linear-gradient(90deg, $primary, $secondary);
    border-radius: 999px;
    transition: width 0.6s ease;
  }
}
</style>

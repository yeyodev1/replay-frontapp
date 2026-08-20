<script setup lang="ts">
import type { SpendStats } from '@/types/video'

defineProps<{ stats: SpendStats }>()
</script>

<template>
  <section class="tiles">
    <article class="tile tile--balance">
      <span class="tile__label"><i class="fa-solid fa-wallet"></i> Saldo disponible</span>
      <strong class="tile__value">
        ${{ stats.balance ? stats.balance.remainUsd.toFixed(2) : '—' }}
      </strong>
      <small v-if="stats.balance">{{ stats.balance.remainCredits.toFixed(1) }} créditos</small>
    </article>

    <article class="tile">
      <span class="tile__label"><i class="fa-solid fa-fire"></i> Consumido (APIMart)</span>
      <strong class="tile__value">
        ${{ stats.balance ? stats.balance.usedUsd.toFixed(3) : '—' }}
      </strong>
      <small>facturación real de la cuenta</small>
    </article>

    <article class="tile">
      <span class="tile__label"><i class="fa-solid fa-calendar-days"></i> Últimos 30 días</span>
      <strong class="tile__value">${{ stats.totals.spentLast30Usd.toFixed(3) }}</strong>
      <small>{{ stats.totals.videos }} videos · {{ stats.totals.secondsGenerated }}s generados</small>
    </article>

    <article class="tile">
      <span class="tile__label"><i class="fa-solid fa-chart-line"></i> Costo promedio</span>
      <strong class="tile__value">${{ stats.totals.avgCostUsd.toFixed(3) }}</strong>
      <small>por video ({{ stats.totals.completed }} listos, {{ stats.totals.failed }} fallidos)</small>
    </article>
  </section>
</template>

<style scoped lang="scss">
.tiles {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1 1 210px;
  background: $white;
  border: 1px solid rgba($primary-dark, 0.07);
  border-radius: 16px;
  padding: 1.1rem 1.25rem;
  box-shadow: 0 3px 14px rgba($primary-dark, 0.05);

  &--balance {
    background: $primary-dark;
    border-color: $primary-dark;

    .tile__label {
      color: rgba($text-light, 0.6);
    }

    .tile__value {
      color: $BAKANO-GREEN;
    }

    small {
      color: rgba($text-light, 0.5);
    }
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $text-secondary;

    i {
      color: $primary;
    }
  }

  &__value {
    font-size: 1.7rem;
    font-weight: 800;
    color: $primary-dark;
  }

  small {
    font-size: 0.72rem;
    color: $text-secondary;
  }
}
</style>

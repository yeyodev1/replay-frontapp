<script setup lang="ts">
import type { SpendStats } from '@/types/video'

defineProps<{ recent: SpendStats['recent'] }>()

const statusLabels: Record<string, string> = {
  pending: 'En cola',
  processing: 'Generando',
  completed: 'Listo',
  failed: 'Falló',
}
</script>

<template>
  <section class="panel">
    <h2><i class="fa-solid fa-receipt"></i> Movimientos recientes</h2>
    <p v-if="!recent.length" class="panel__empty">Sin movimientos todavía.</p>
    <div class="moves">
      <article v-for="r in recent" :key="r._id" class="move">
        <span class="move__status" :class="`is-${r.status}`">
          <i
            :class="
              r.status === 'completed'
                ? 'fa-solid fa-circle-check'
                : r.status === 'failed'
                  ? 'fa-solid fa-circle-xmark'
                  : 'fa-solid fa-spinner fa-spin'
            "
          ></i>
        </span>
        <span class="move__info">
          <strong :title="r.prompt">{{ r.prompt }}</strong>
          <small>
            {{ r.modelName }} · {{ r.resolution }} · {{ r.duration }}s ·
            {{ new Date(r.createdAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' }) }}
            · {{ statusLabels[r.status] }}
          </small>
        </span>
        <span class="move__cost">
          <strong>${{ (r.actualCostUsd ?? r.estimatedCostUsd).toFixed(3) }}</strong>
          <small>{{ r.actualCostUsd !== undefined ? 'real' : 'estimado' }}</small>
        </span>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/components/spend/spendPanel.scss' as *;

.moves {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.move {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid rgba($primary-dark, 0.07);
  border-radius: 12px;
  padding: 0.65rem 0.9rem;

  &__status {
    flex-shrink: 0;
    font-size: 1rem;

    &.is-completed { color: $alert-success; }
    &.is-failed { color: $alert-error; }
    &.is-pending, &.is-processing { color: $alert-info; }
  }

  &__info {
    display: flex;
    flex-direction: column;
    min-width: 0;

    strong {
      font-size: 0.8rem;
      color: $primary-dark;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    small {
      font-size: 0.68rem;
      color: $text-secondary;
    }
  }

  &__cost {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: auto;
    flex-shrink: 0;

    strong {
      font-size: 0.84rem;
      color: $primary-dark;
    }

    small {
      font-size: 0.62rem;
      font-weight: 700;
      text-transform: uppercase;
      color: $text-secondary;
    }
  }
}
</style>

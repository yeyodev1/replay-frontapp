<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { videoService } from '@/services/video.service'
import type { SpendStats } from '@/types/video'
import SpendTiles from '@/components/spend/SpendTiles.vue'
import SpendByModel from '@/components/spend/SpendByModel.vue'
import SpendMoves from '@/components/spend/SpendMoves.vue'

const stats = ref<SpendStats | null>(null)
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    stats.value = await videoService.getStats()
  } catch (e: any) {
    error.value = e?.message || 'Error cargando los gastos'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="spend">
    <header class="spend__head">
      <div>
        <h1><i class="fa-solid fa-coins"></i> Gastos</h1>
        <p>Saldo APIMart en tiempo real y todo lo que has invertido en videos</p>
      </div>
      <button class="spend__refresh" @click="load" :disabled="loading">
        <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loading }"></i> Actualizar
      </button>
    </header>

    <p v-if="error" class="spend__error">
      <i class="fa-solid fa-circle-exclamation"></i>{{ error }}
    </p>

    <template v-if="loading && !stats">
      <section class="tiles-sk">
        <article class="tile-sk tile-sk--dark">
          <span class="sk-shimmer sk-shimmer--dark" style="height: 10px; width: 90px;"></span>
          <span class="sk-shimmer sk-shimmer--dark" style="height: 26px; width: 80px;"></span>
          <span class="sk-shimmer sk-shimmer--dark" style="height: 9px; width: 110px;"></span>
        </article>
        <article v-for="n in 3" :key="n" class="tile-sk">
          <span class="sk-shimmer" style="height: 10px; width: 100px;"></span>
          <span class="sk-shimmer" style="height: 26px; width: 70px;"></span>
          <span class="sk-shimmer" style="height: 9px; width: 120px;"></span>
        </article>
      </section>
    </template>

    <template v-if="stats">
      <SpendTiles :stats="stats" />
      <div class="spend__cols">
        <SpendByModel :by-model="stats.byModel" />
        <SpendMoves :recent="stats.recent" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.spend {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1.8rem 2rem 3rem;

  &__head {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;

    h1 {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.4rem;
      font-weight: 800;
      color: $primary-dark;

      i {
        color: $primary;
      }
    }

    p {
      font-size: 0.82rem;
      color: $text-secondary;
      margin-top: 0.2rem;
    }
  }

  &__refresh {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
    font-family: $font-principal;
    font-size: 0.8rem;
    font-weight: 700;
    color: $primary-dark;
    background: $white;
    border: 1.5px solid rgba($primary-dark, 0.14);
    border-radius: 12px;
    padding: 0.55rem 1rem;

    &:hover {
      border-color: $primary;
      color: $primary;
    }
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    color: $alert-error;
    background: $alert-error-bg;
    border-radius: 10px;
    padding: 0.7rem 1rem;
  }

  &__cols {
    display: flex;
    align-items: flex-start;
    gap: 1.2rem;
    flex-wrap: wrap;
  }
}

.tiles-sk {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.tile-sk {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  flex: 1 1 180px;
  background: $white;
  border: 1px solid rgba($primary-dark, 0.07);
  border-radius: 16px;
  padding: 1.1rem 1.25rem;

  &--dark {
    background: $primary-dark;
    border-color: $primary-dark;
  }
}

@media (max-width: 720px) {
  .spend {
    padding: 1.2rem 1.1rem 2.5rem;
  }
}
</style>

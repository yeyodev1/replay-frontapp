<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useVideosStore } from '@/stores/videos'
import VideoCard from '@/components/VideoCard.vue'
import type { VideoJob } from '@/types/video'

const store = useVideosStore()
const router = useRouter()
const { jobs, loading } = storeToRefs(store)

type Filter = 'todos' | 'activos' | 'listos' | 'fallidos'
const filter = ref<Filter>('todos')

const filters: Array<{ id: Filter; label: string; icon: string }> = [
  { id: 'todos', label: 'Todos', icon: 'fa-solid fa-layer-group' },
  { id: 'activos', label: 'En proceso', icon: 'fa-solid fa-spinner' },
  { id: 'listos', label: 'Listos', icon: 'fa-solid fa-circle-check' },
  { id: 'fallidos', label: 'Fallidos', icon: 'fa-solid fa-circle-xmark' },
]

const filtered = computed(() => {
  switch (filter.value) {
    case 'activos':
      return jobs.value.filter((j) => j.status === 'pending' || j.status === 'processing')
    case 'listos':
      return jobs.value.filter((j) => j.status === 'completed')
    case 'fallidos':
      return jobs.value.filter((j) => j.status === 'failed')
    default:
      return jobs.value
  }
})

const totalSpent = computed(() =>
  jobs.value
    .filter((j) => j.status !== 'failed')
    .reduce((sum, j) => sum + (j.estimatedCostUsd || 0), 0),
)

function replicate(job: VideoJob) {
  store.setPrefill(job)
  router.push('/')
}

async function replicateExact(job: VideoJob) {
  if (!confirm(`Repetir exacto (mismo JSON) por ~$${job.estimatedCostUsd.toFixed(2)}?`)) return
  await store.replicateExact(job._id)
}

async function removeJob(id: string) {
  if (!confirm('¿Eliminar este video del historial?')) return
  await store.deleteVideo(id)
}

onMounted(() => store.fetchJobs())
onBeforeUnmount(() => store.stopPolling())
</script>

<template>
  <div class="videos">
    <header class="videos__head">
      <div class="videos__title">
        <h1><i class="fa-solid fa-film"></i> Mis videos</h1>
        <p>
          {{ jobs.length }} video{{ jobs.length === 1 ? '' : 's' }} ·
          inversión total ~${{ totalSpent.toFixed(2) }}
        </p>
      </div>

      <router-link to="/" class="videos__new">
        <i class="fa-solid fa-plus"></i> Nuevo video
      </router-link>
    </header>

    <div class="videos__filters">
      <button
        v-for="f in filters"
        :key="f.id"
        class="filter-pill"
        :class="{ 'is-on': filter === f.id }"
        @click="filter = f.id"
      >
        <i :class="f.icon"></i> {{ f.label }}
      </button>
      <span v-if="store.activeJobs.length" class="videos__live">
        <span class="dot"></span>{{ store.activeJobs.length }} generándose
      </span>
    </div>

    <p v-if="loading && !jobs.length" class="videos__empty">Cargando…</p>

    <div v-else-if="!filtered.length" class="videos__empty-state">
      <i class="fa-solid fa-clapperboard"></i>
      <p v-if="filter === 'todos'">Todavía no hay videos.</p>
      <p v-else>Nada en "{{ filters.find((f) => f.id === filter)?.label }}".</p>
      <router-link to="/" class="videos__new">
        <i class="fa-solid fa-wand-magic-sparkles"></i> Generar el primero
      </router-link>
    </div>

    <TransitionGroup name="cards" tag="div" class="videos__grid">
      <VideoCard
        v-for="job in filtered"
        :key="job._id"
        :job="job"
        @delete="removeJob"
        @replicate="replicate"
        @replicate-exact="replicateExact"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.videos {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 1.8rem 2rem 3rem;

  &__head {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__title {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

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
    }
  }

  &__new {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
    font-size: 0.85rem;
    font-weight: 800;
    color: $white;
    background: $primary;
    border-radius: 12px;
    padding: 0.65rem 1.1rem;
    text-decoration: none;
    transition: background 0.15s ease;

    &:hover {
      background: darken($primary, 8);
    }
  }

  &__filters {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__live {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: $alert-info;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $alert-info;
      animation: pulse 1.4s ease infinite;
    }
  }

  &__empty {
    color: $text-secondary;
    font-size: 0.9rem;
  }

  &__empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    padding: 3.5rem 1rem;
    color: $text-secondary;

    i {
      font-size: 2.2rem;
      color: rgba($primary-dark, 0.18);
    }

    p {
      font-size: 0.9rem;
    }

    .videos__new {
      margin-left: 0;
    }
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.1rem;

    > * {
      flex: 1 1 300px;
      max-width: 420px;
    }
  }
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: $font-principal;
  font-size: 0.78rem;
  font-weight: 700;
  color: $primary-dark;
  background: $white;
  border: 1.5px solid rgba($primary-dark, 0.12);
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  transition: all 0.15s ease;

  &:hover {
    border-color: rgba($primary, 0.5);
  }

  &.is-on {
    background: $primary-dark;
    border-color: $primary-dark;
    color: $text-light;
  }
}

.cards-enter-active,
.cards-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.cards-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.cards-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

@keyframes pulse {
  50% {
    opacity: 0.35;
  }
}

@media (max-width: 720px) {
  .videos {
    padding: 1.2rem 1.1rem 2.5rem;
  }
}
</style>

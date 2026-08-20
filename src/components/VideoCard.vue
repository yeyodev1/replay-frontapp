<script setup lang="ts">
import { computed } from 'vue'
import type { VideoJob } from '@/types/video'
import VideoCardMedia from './VideoCardMedia.vue'

const props = defineProps<{ job: VideoJob }>()
const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'replicate', job: VideoJob): void
}>()

const statusLabel = computed(() => {
  switch (props.job.status) {
    case 'pending':
      return 'En cola'
    case 'processing':
      return 'Generando…'
    case 'completed':
      return 'Listo'
    case 'failed':
      return 'Falló'
  }
})

const createdAt = computed(() =>
  new Date(props.job.createdAt).toLocaleString('es-EC', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }),
)
</script>

<template>
  <article class="video-card">
    <VideoCardMedia :job="job" :status-label="statusLabel || ''" />

    <div class="video-card__body">
      <p class="video-card__prompt" :title="job.prompt">{{ job.prompt }}</p>

      <div class="video-card__meta">
        <span class="chip chip--model">{{ job.modelName }}</span>
        <span class="chip">{{ job.resolution }}</span>
        <span class="chip">{{ job.duration }}s</span>
        <span class="chip" v-if="job.aspectRatio !== 'auto'">{{ job.aspectRatio }}</span>
        <span class="chip" v-if="job.imageUrls?.length"><i class="fa-regular fa-image"></i> con imagen</span>
        <span class="chip" v-if="job.options?.seed !== undefined && job.options?.seed !== null"
          ><i class="fa-solid fa-seedling"></i> seed {{ job.options.seed }}</span
        >
        <span class="chip chip--cost">${{ job.estimatedCostUsd.toFixed(2) }}</span>
      </div>

      <div class="video-card__footer">
        <span class="video-card__status" :class="`is-${job.status}`">
          {{ statusLabel }}
        </span>
        <span class="video-card__date">{{ createdAt }}</span>
        <div class="video-card__actions">
          <button class="btn-replicate" title="Volver a generar con esta misma configuración" @click="emit('replicate', job)">
            <i class="fa-solid fa-clone"></i> Replicar
          </button>
          <a
            v-if="job.videoUrl"
            :href="job.videoUrl"
            target="_blank"
            rel="noopener"
            class="btn-link"
          >
            <i class="fa-solid fa-download"></i>
          </a>
          <button class="btn-delete" title="Eliminar" @click="emit('delete', job._id)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>

      <p v-if="job.status === 'completed'" class="video-card__warning">
        ⚠️ El link expira en 24h — descárgalo pronto.
      </p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.video-card {
  display: flex;
  flex-direction: column;
  background: $white;
  border: 1px solid rgba($primary-dark, 0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba($primary-dark, 0.06);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba($primary-dark, 0.12);
    transform: translateY(-2px);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }

  &__prompt {
    font-size: 0.9rem;
    color: $primary-dark;
    font-weight: 500;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  &__footer {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__status {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;

    &.is-pending {
      color: $alert-warning;
      background: $alert-warning-bg;
    }
    &.is-processing {
      color: $alert-info;
      background: $alert-info-bg;
    }
    &.is-completed {
      color: $alert-success;
      background: $alert-success-bg;
    }
    &.is-failed {
      color: $alert-error;
      background: $alert-error-bg;
    }
  }

  &__date {
    font-size: 0.72rem;
    color: $text-secondary;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-left: auto;
  }

  &__warning {
    font-size: 0.72rem;
    color: $alert-warning;
  }
}

.chip {
  font-size: 0.7rem;
  font-weight: 600;
  color: $text-secondary;
  background: rgba($primary-dark, 0.05);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;

  &--model {
    color: $secondary-dark;
    background: $overlay-purple;
  }

  &--cost {
    color: $primary;
    background: rgba($primary, 0.08);
  }
}

.btn-link {
  font-size: 0.78rem;
  font-weight: 700;
  color: $primary;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.btn-delete {
  font-size: 0.78rem;
  font-weight: 600;
  color: $text-secondary;
  background: none;
  border: none;
  font-family: inherit;
  padding: 0.3rem;

  &:hover {
    color: $alert-error;
  }
}

.btn-replicate {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  color: $secondary-dark;
  background: $overlay-purple;
  border: none;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  transition: background 0.15s ease;

  &:hover {
    background: rgba($secondary, 0.22);
  }
}

</style>

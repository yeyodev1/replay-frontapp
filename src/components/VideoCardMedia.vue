<script setup lang="ts">
import { computed } from 'vue'
import type { VideoJob } from '@/types/video'

const props = defineProps<{ job: VideoJob; statusLabel: string }>()

const isActive = computed(
  () => props.job.status === 'pending' || props.job.status === 'processing',
)
</script>

<template>
  <div class="media">
    <video
      v-if="job.status === 'completed' && job.videoUrl"
      :src="job.videoUrl"
      controls
      preload="metadata"
      playsinline
    />
    <div v-else class="media__placeholder" :class="`is-${job.status}`">
      <span v-if="isActive" class="spinner" aria-hidden="true"></span>
      <span class="media__text">{{ statusLabel }}</span>
      <span v-if="job.status === 'failed' && job.error" class="media__error">
        {{ job.error }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.media {
  display: flex;
  background: $primary-dark;

  video {
    width: 100%;
    max-height: 260px;
    background: $primary-dark;
  }

  &__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    min-height: 180px;
    padding: 1rem;
    color: $text-light;
    background: linear-gradient(135deg, $primary-dark, darken($secondary-dark, 10));

    &.is-failed {
      background: linear-gradient(135deg, $primary-dark, darken($alert-error, 30));
    }
  }

  &__text {
    font-weight: 600;
    font-size: 0.9rem;
  }

  &__error {
    font-size: 0.75rem;
    opacity: 0.8;
    text-align: center;
    max-width: 90%;
  }
}

.spinner {
  width: 26px;
  height: 26px;
  border: 3px solid rgba($white, 0.25);
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

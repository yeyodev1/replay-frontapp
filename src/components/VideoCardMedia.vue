<script setup lang="ts">
import { computed } from 'vue'
import type { VideoJob } from '@/types/video'


/* Póster de marca mientras el video no reproduce (SVG inline, sin requests) */
const POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%23191423"/><stop offset="1" stop-color="%235c3070"/></linearGradient></defs><rect width="640" height="360" fill="url(%23g)"/><circle cx="320" cy="164" r="46" fill="%23e6285c" opacity="0.95"/><polygon points="306,140 306,188 348,164" fill="white"/><text x="320" y="248" text-anchor="middle" font-family="Montserrat, Arial" font-size="20" font-weight="700" fill="white" opacity="0.85">Replay</text><text x="320" y="274" text-anchor="middle" font-family="Montserrat, Arial" font-size="13" fill="white" opacity="0.5">toca para reproducir</text></svg>`,
  )

const props = defineProps<{ job: VideoJob; statusLabel: string }>()

const isActive = computed(
  () => props.job.status === 'pending' || props.job.status === 'processing',
)

const pct = computed(() => {
  const p = props.job.progress
  return typeof p === 'number' && p > 0 ? Math.min(p, 99) : null
})

/** ETA aproximado: tiempo transcurrido escalado por el % restante */
const eta = computed(() => {
  if (pct.value === null || pct.value < 5) return null
  const elapsed = (Date.now() - new Date(props.job.createdAt).getTime()) / 1000
  const remaining = Math.round((elapsed * (100 - pct.value)) / pct.value)
  if (remaining <= 0 || remaining > 600) return null
  return remaining
})
</script>

<template>
  <div class="media">
    <video
      v-if="job.status === 'completed' && job.videoUrl"
      :src="job.videoUrl"
      :poster="POSTER"
      controls
      preload="none"
      playsinline
    />
    <div v-else class="media__placeholder" :class="`is-${job.status}`">
      <span v-if="isActive && pct === null" class="spinner" aria-hidden="true"></span>
      <span class="media__text">{{ statusLabel }}{{ pct !== null ? ' ' + pct + '%' : '' }}</span>
      <div v-if="isActive && pct !== null" class="media__bar">
        <div class="media__bar-fill" :style="{ width: pct + '%' }"></div>
      </div>
      <span v-if="eta !== null" class="media__eta">~{{ eta }} s restantes</span>
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

  &__bar {
    display: flex;
    width: 70%;
    height: 6px;
    background: rgba($white, 0.15);
    border-radius: 999px;
    overflow: hidden;
  }

  &__bar-fill {
    background: $primary;
    border-radius: 999px;
    transition: width 0.8s ease;
  }

  &__eta {
    font-size: 0.7rem;
    color: rgba($white, 0.6);
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

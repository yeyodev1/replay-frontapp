<script setup lang="ts">
import { computed } from 'vue'
import type { Asset, AssetType } from '@/types/video'

const props = defineProps<{ assets: Asset[]; loading: boolean }>()
const emit = defineEmits<{ (e: 'delete', asset: Asset): void }>()

const groups: Array<{ id: AssetType; label: string; icon: string }> = [
  { id: 'escenario', label: 'Escenarios', icon: 'fa-solid fa-mountain-sun' },
  { id: 'avatar', label: 'Avatars', icon: 'fa-solid fa-user-astronaut' },
  { id: 'perspectiva', label: 'Perspectivas', icon: 'fa-solid fa-camera' },
  { id: 'voz', label: 'Voces', icon: 'fa-solid fa-microphone-lines' },
  { id: 'otro', label: 'Otros', icon: 'fa-solid fa-shapes' },
]

const grouped = computed(() =>
  groups
    .map((g) => ({ ...g, items: props.assets.filter((a) => a.type === g.id) }))
    .filter((g) => g.items.length),
)
</script>

<template>
  <section class="gallery">
    <h2><i class="fa-solid fa-images"></i> Biblioteca ({{ assets.length }})</h2>

    <p v-if="loading && !assets.length" class="gallery__empty">Cargando…</p>
    <p v-else-if="!assets.length" class="gallery__empty">
      Vacía por ahora — sube tu primer escenario, avatar o voz.
    </p>

    <div v-for="g in grouped" :key="g.id" class="group">
      <h3><i :class="g.icon"></i> {{ g.label }} ({{ g.items.length }})</h3>
      <div class="group__items">
        <article v-for="a in g.items" :key="a._id" class="asset">
          <img v-if="a.resourceType === 'image'" :src="a.url" :alt="a.name" loading="lazy" />
          <div v-else class="asset__audio">
            <i class="fa-solid fa-waveform-lines fa-microphone-lines"></i>
            <audio :src="a.url" controls preload="none"></audio>
          </div>
          <div class="asset__foot">
            <span class="asset__name" :title="a.name">{{ a.name }}</span>
            <button class="asset__del" title="Eliminar" @click="emit('delete', a)">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.gallery {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  flex: 1 1 400px;
  min-width: 290px;
  background: $white;
  border: 1px solid rgba($primary-dark, 0.08);
  border-radius: 18px;
  padding: 1.4rem;
  box-shadow: 0 4px 20px rgba($primary-dark, 0.06);

  h2 {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 1rem;
    font-weight: 800;
    color: $primary-dark;

    i { color: $primary; }
  }

  &__empty {
    font-size: 0.84rem;
    color: $text-secondary;
  }
}

.group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $text-secondary;

    i { color: $secondary-dark; }
  }

  &__items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
  }
}

.asset {
  display: flex;
  flex-direction: column;
  flex: 0 1 160px;
  border: 1px solid rgba($primary-dark, 0.1);
  border-radius: 12px;
  overflow: hidden;
  background: $white;

  img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    background: rgba($primary-dark, 0.05);
  }

  &__audio {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    padding: 0.7rem 0.5rem 0.3rem;
    color: $secondary-dark;

    audio {
      width: 100%;
      height: 30px;
    }
  }

  &__foot {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.6rem;
  }

  &__name {
    font-size: 0.7rem;
    font-weight: 700;
    color: $primary-dark;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1 1 auto;
  }

  &__del {
    background: none;
    border: none;
    color: $text-secondary;
    font-size: 0.72rem;
    padding: 0.2rem;

    &:hover { color: $alert-error; }
  }
}
</style>

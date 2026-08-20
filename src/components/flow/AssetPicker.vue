<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { assetService } from '@/services/asset.service'
import type { Asset } from '@/types/video'

const props = defineProps<{
  kind: 'image' | 'voz'
  modelValue: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', url: string): void }>()

const assets = ref<Asset[]>([])
const loading = ref(true)

const items = computed(() =>
  props.kind === 'voz'
    ? assets.value.filter((a) => a.type === 'voz')
    : assets.value.filter((a) => a.resourceType === 'image'),
)

function toggle(url: string) {
  emit('update:modelValue', props.modelValue === url ? '' : url)
}

onMounted(async () => {
  try {
    assets.value = await assetService.list()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading || items.length" class="picker">
    <span class="picker__label">
      <i :class="kind === 'voz' ? 'fa-solid fa-microphone-lines' : 'fa-solid fa-box-archive'"></i>
      {{ kind === 'voz' ? 'Mis voces' : 'Mis recursos' }}
      <em>toca para usar</em>
    </span>

    <p v-if="loading" class="picker__loading">Cargando biblioteca…</p>

    <div v-else class="picker__strip">
      <button
        v-for="a in items"
        :key="a._id"
        type="button"
        class="picker__item"
        :class="{ 'is-on': modelValue === a.url }"
        :title="a.name"
        @click="toggle(a.url)"
      >
        <img v-if="kind === 'image'" :src="a.url" :alt="a.name" loading="lazy" />
        <span v-else class="picker__voice"><i class="fa-solid fa-microphone-lines"></i></span>
        <small>{{ a.name }}</small>
        <i v-if="modelValue === a.url" class="fa-solid fa-circle-check picker__check"></i>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.picker {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;

  &__label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $primary-dark;

    i { color: $secondary-dark; }

    em {
      font-style: normal;
      text-transform: none;
      letter-spacing: 0;
      font-size: 0.68rem;
      font-weight: 500;
      color: $text-secondary;
    }
  }

  &__loading {
    font-size: 0.74rem;
    color: $text-secondary;
  }

  &__strip {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.3rem;
  }

  &__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    flex: 0 0 84px;
    background: $white;
    border: 2px solid rgba($primary-dark, 0.12);
    border-radius: 12px;
    padding: 0.3rem;
    font-family: $font-principal;

    img {
      width: 100%;
      height: 54px;
      object-fit: cover;
      border-radius: 8px;
    }

    small {
      font-size: 0.6rem;
      font-weight: 700;
      color: $primary-dark;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:hover { border-color: rgba($primary, 0.5); }

    &.is-on {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.15);
    }
  }

  &__voice {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 54px;
    border-radius: 8px;
    background: $overlay-purple;
    color: $secondary-dark;
    font-size: 1.2rem;
  }

  &__check {
    position: absolute;
    top: -6px;
    right: -6px;
    color: $BAKANO-GREEN;
    background: $white;
    border-radius: 50%;
    font-size: 0.95rem;
  }
}
</style>

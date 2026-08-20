<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { assetService, fileToDataUri } from '@/services/asset.service'
import type { Asset, AssetType } from '@/types/video'

const props = defineProps<{
  assetType: AssetType
  modelValue: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', url: string): void }>()

const META: Record<string, { label: string; icon: string; empty: string }> = {
  escenario: { label: 'Escenario', icon: 'fa-solid fa-mountain-sun', empty: 'Sube tu primer escenario' },
  avatar: { label: 'Avatar', icon: 'fa-solid fa-user-astronaut', empty: 'Sube tu primer avatar' },
  perspectiva: { label: 'Perspectiva', icon: 'fa-solid fa-camera', empty: 'Sube una perspectiva' },
  voz: { label: 'Voz', icon: 'fa-solid fa-microphone-lines', empty: 'Sube tu primera voz (mp3/wav 3-30s)' },
  otro: { label: 'Referencia', icon: 'fa-solid fa-shapes', empty: 'Sube una referencia' },
}

const assets = ref<Asset[]>([])
const loading = ref(true)
const uploading = ref(false)
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const meta = computed(() => META[props.assetType] ?? META.otro!)
const isVoice = computed(() => props.assetType === 'voz')

async function load() {
  loading.value = true
  try {
    assets.value = await assetService.list(props.assetType)
  } finally {
    loading.value = false
  }
}

function toggle(url: string) {
  emit('update:modelValue', props.modelValue === url ? '' : url)
}

async function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const maxMb = isVoice.value ? 15 : 10
  if (file.size > maxMb * 1024 * 1024) {
    error.value = `Máximo ${maxMb}MB`
    return
  }
  uploading.value = true
  error.value = ''
  try {
    const dataUri = await fileToDataUri(file)
    const name = file.name.replace(/\.[^.]+$/, '')
    const created = await assetService.create(name, props.assetType, dataUri)
    assets.value.unshift(created)
    emit('update:modelValue', created.url)
  } catch (err: any) {
    error.value = err?.message || 'Error subiendo'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

onMounted(load)
</script>

<template>
  <div class="picker">
    <span class="picker__label">
      <i :class="meta.icon"></i> {{ meta.label }}
      <em v-if="modelValue" class="picker__selected"><i class="fa-solid fa-check"></i> elegido</em>
      <em v-else>opcional</em>
    </span>

    <div class="picker__strip">
      <!-- Subir nuevo, sin salir del flujo -->
      <button type="button" class="picker__add" :disabled="uploading" @click="fileInput?.click()">
        <i :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-plus'"></i>
        <small>{{ uploading ? 'Subiendo…' : 'Subir' }}</small>
      </button>
      <input
        ref="fileInput"
        type="file"
        :accept="isVoice ? 'audio/*' : 'image/*'"
        class="picker__file"
        @change="onFile"
      />

      <p v-if="loading" class="picker__loading">Cargando…</p>
      <p v-else-if="!assets.length" class="picker__loading">{{ meta.empty }}</p>

      <button
        v-for="a in assets"
        :key="a._id"
        type="button"
        class="picker__item"
        :class="{ 'is-on': modelValue === a.url }"
        :title="a.name"
        @click="toggle(a.url)"
      >
        <img v-if="!isVoice" :src="a.url" :alt="a.name" loading="lazy" />
        <span v-else class="picker__voice"><i class="fa-solid fa-microphone-lines"></i></span>
        <small>{{ a.name }}</small>
        <i v-if="modelValue === a.url" class="fa-solid fa-circle-check picker__check"></i>
      </button>
    </div>

    <p v-if="error" class="picker__error"><i class="fa-solid fa-circle-exclamation"></i>{{ error }}</p>
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

  &__selected {
    color: $BAKANO-GREEN !important;
    font-weight: 700 !important;
  }

  &__strip {
    display: flex;
    align-items: stretch;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.3rem;
  }

  &__file {
    display: none;
  }

  &__add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    flex: 0 0 84px;
    min-height: 84px;
    border: 2px dashed rgba($primary-dark, 0.22);
    border-radius: 12px;
    background: none;
    color: $text-secondary;
    font-family: $font-principal;

    small {
      font-size: 0.62rem;
      font-weight: 700;
    }

    &:hover {
      border-color: $primary;
      color: $primary;
    }
  }

  &__loading {
    align-self: center;
    font-size: 0.74rem;
    color: $text-secondary;
    padding: 0 0.5rem;
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

  &__error {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
    color: $alert-error;
  }
}
</style>

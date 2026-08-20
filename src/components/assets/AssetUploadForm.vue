<script setup lang="ts">
import { computed, ref } from 'vue'
import { assetService, fileToDataUri } from '@/services/asset.service'
import type { AssetType } from '@/types/video'

const emit = defineEmits<{ (e: 'created'): void }>()

const name = ref('')
const type = ref<AssetType>('escenario')
const file = ref<File | null>(null)
const uploading = ref(false)
const error = ref('')
const success = ref('')

const typeOptions: Array<{ id: AssetType; label: string; icon: string; hint: string }> = [
  { id: 'escenario', label: 'Escenario', icon: 'fa-solid fa-mountain-sun', hint: 'Fondos y locaciones' },
  { id: 'avatar', label: 'Avatar', icon: 'fa-solid fa-user-astronaut', hint: 'Personajes y rostros' },
  { id: 'perspectiva', label: 'Perspectiva', icon: 'fa-solid fa-camera', hint: 'Ángulos y encuadres de referencia' },
  { id: 'voz', label: 'Voz', icon: 'fa-solid fa-microphone-lines', hint: 'Audio mp3/wav de 3-30s' },
  { id: 'otro', label: 'Otro', icon: 'fa-solid fa-shapes', hint: 'Cualquier otra referencia' },
]

const accept = computed(() => (type.value === 'voz' ? 'audio/*' : 'image/*'))

function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  file.value = input.files?.[0] ?? null
  if (file.value && !name.value.trim()) {
    name.value = file.value.name.replace(/\.[^.]+$/, '')
  }
}

async function submit() {
  if (!file.value) return
  const maxMb = type.value === 'voz' ? 15 : 10
  if (file.value.size > maxMb * 1024 * 1024) {
    error.value = `El archivo supera ${maxMb}MB`
    return
  }
  uploading.value = true
  error.value = ''
  success.value = ''
  try {
    const dataUri = await fileToDataUri(file.value)
    await assetService.create(name.value.trim(), type.value, dataUri)
    success.value = `"${name.value.trim()}" subido ✓`
    name.value = ''
    file.value = null
    emit('created')
  } catch (e: any) {
    error.value = e?.message || 'Error subiendo el recurso'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <section class="uploader">
    <h2><i class="fa-solid fa-cloud-arrow-up"></i> Subir recurso</h2>

    <div class="uploader__types">
      <button
        v-for="t in typeOptions"
        :key="t.id"
        type="button"
        class="type-pill"
        :class="{ 'is-on': type === t.id }"
        :title="t.hint"
        @click="type = t.id"
      >
        <i :class="t.icon"></i> {{ t.label }}
      </button>
    </div>

    <p class="uploader__hint">{{ typeOptions.find((t) => t.id === type)?.hint }}</p>

    <label class="uploader__drop">
      <input type="file" :accept="accept" @change="onFile" />
      <i :class="type === 'voz' ? 'fa-solid fa-microphone-lines' : 'fa-regular fa-image'"></i>
      <span v-if="file">{{ file.name }}</span>
      <span v-else>Haz clic para elegir {{ type === 'voz' ? 'un audio' : 'una imagen' }}</span>
    </label>

    <label class="uploader__name">
      <span>Nombre</span>
      <input v-model="name" type="text" placeholder="Ej: Cafetería centro GYE" required />
    </label>

    <p v-if="error" class="uploader__msg uploader__msg--error">
      <i class="fa-solid fa-circle-exclamation"></i>{{ error }}
    </p>
    <p v-if="success" class="uploader__msg uploader__msg--ok">
      <i class="fa-solid fa-circle-check"></i>{{ success }}
    </p>

    <button class="uploader__go" :disabled="uploading || !file || !name.trim()" @click="submit">
      <i class="fa-solid fa-cloud-arrow-up"></i>
      {{ uploading ? 'Subiendo…' : 'Subir a la biblioteca' }}
    </button>
  </section>
</template>

<style scoped lang="scss">
.uploader {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  flex: 0 1 360px;
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

  &__types {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  &__hint {
    font-size: 0.72rem;
    color: $text-secondary;
  }

  &__drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: 2px dashed rgba($primary-dark, 0.18);
    border-radius: 14px;
    padding: 1.6rem 1rem;
    text-align: center;
    font-size: 0.82rem;
    color: $text-secondary;
    transition: border-color 0.15s ease;

    &:hover { border-color: $primary; color: $primary; }

    input { display: none; }

    i { font-size: 1.4rem; }
  }

  &__name {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    span {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: $primary-dark;
    }

    input {
      font-family: $font-principal;
      font-size: 0.88rem;
      color: $primary-dark;
      border: 1.5px solid rgba($primary-dark, 0.13);
      border-radius: 11px;
      padding: 0.65rem 0.8rem;
      outline: none;

      &:focus { border-color: $primary; }
    }
  }

  &__msg {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    border-radius: 10px;
    padding: 0.6rem 0.8rem;

    &--error { color: $alert-error; background: $alert-error-bg; }
    &--ok { color: $alert-success; background: $alert-success-bg; }
  }

  &__go {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: $font-principal;
    font-size: 0.9rem;
    font-weight: 800;
    color: $white;
    background: $primary;
    border: none;
    border-radius: 12px;
    padding: 0.8rem;

    &:hover:not(:disabled) { background: darken($primary, 8); }
    &:disabled { opacity: 0.5; }
  }
}

.type-pill {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: $font-principal;
  font-size: 0.75rem;
  font-weight: 700;
  color: $primary-dark;
  background: $white;
  border: 1.5px solid rgba($primary-dark, 0.14);
  border-radius: 999px;
  padding: 0.4rem 0.8rem;

  &:hover { border-color: rgba($primary, 0.5); }

  &.is-on {
    background: $primary;
    border-color: $primary;
    color: $white;
  }
}
</style>

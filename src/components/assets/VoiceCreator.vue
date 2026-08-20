<script setup lang="ts">
import { ref } from 'vue'
import { assetService } from '@/services/asset.service'

const emit = defineEmits<{ (e: 'created'): void }>()

const name = ref('')
const text = ref('')
const voice = ref('nova')
const speed = ref(1)
const creating = ref(false)
const error = ref('')
const success = ref('')

const voices = [
  { id: 'nova', label: 'Nova', desc: 'Femenina, cálida' },
  { id: 'shimmer', label: 'Shimmer', desc: 'Femenina, suave' },
  { id: 'alloy', label: 'Alloy', desc: 'Neutra, versátil' },
  { id: 'fable', label: 'Fable', desc: 'Narrador, expresiva' },
  { id: 'onyx', label: 'Onyx', desc: 'Masculina, profunda' },
  { id: 'echo', label: 'Echo', desc: 'Masculina, clara' },
]

async function submit() {
  creating.value = true
  error.value = ''
  success.value = ''
  try {
    await assetService.createVoice(name.value.trim(), text.value.trim(), voice.value, speed.value)
    success.value = `Voz "${name.value.trim()}" creada ✓`
    name.value = ''
    text.value = ''
    emit('created')
  } catch (e: any) {
    error.value = e?.message || 'Error generando la voz'
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <section class="creator">
    <h2><i class="fa-solid fa-microphone-lines"></i> Crear voz con IA</h2>
    <p class="creator__hint">Escribe el guion, elige la voz y se guarda lista para tus videos.</p>

    <label class="creator__field">
      <span>Nombre</span>
      <input v-model="name" type="text" placeholder="Ej: Locutora promo agosto" />
    </label>

    <label class="creator__field">
      <span>Guion <em>{{ text.length }}/4096</em></span>
      <textarea
        v-model="text"
        rows="3"
        maxlength="4096"
        placeholder="¡Hola! Bienvenido a Bakano, donde tus ideas se vuelven video…"
      ></textarea>
    </label>

    <div class="creator__voices">
      <button
        v-for="v in voices"
        :key="v.id"
        type="button"
        class="voice-pill"
        :class="{ 'is-on': voice === v.id }"
        :title="v.desc"
        @click="voice = v.id"
      >
        {{ v.label }}
      </button>
    </div>

    <label class="creator__speed">
      <span><i class="fa-solid fa-gauge-high"></i> Velocidad: {{ speed.toFixed(1) }}x</span>
      <input v-model.number="speed" type="range" min="0.5" max="1.5" step="0.1" />
    </label>

    <p v-if="error" class="creator__msg is-error">
      <i class="fa-solid fa-circle-exclamation"></i>{{ error }}
    </p>
    <p v-if="success" class="creator__msg is-ok">
      <i class="fa-solid fa-circle-check"></i>{{ success }}
    </p>

    <button class="creator__go" :disabled="creating || !name.trim() || !text.trim()" @click="submit">
      <i :class="creating ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-wand-magic-sparkles'"></i>
      {{ creating ? 'Generando voz…' : 'Generar voz' }}
    </button>
  </section>
</template>

<style scoped lang="scss">
@use './creatorStyles.scss' as *;

.creator__voices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.voice-pill {
  font-family: $font-principal;
  font-size: 0.75rem;
  font-weight: 700;
  color: $primary-dark;
  background: $white;
  border: 1.5px solid rgba($primary-dark, 0.14);
  border-radius: 999px;
  padding: 0.4rem 0.85rem;

  &:hover { border-color: rgba($secondary, 0.6); }

  &.is-on {
    background: $secondary;
    border-color: $secondary;
    color: $white;
  }
}

.creator__speed {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  span {
    font-size: 0.74rem;
    font-weight: 700;
    color: $primary-dark;

    i { color: $secondary-dark; margin-right: 0.3rem; }
  }

  input[type='range'] {
    accent-color: #85529c;
  }
}
</style>

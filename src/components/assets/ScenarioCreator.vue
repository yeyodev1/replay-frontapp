<script setup lang="ts">
import { ref } from 'vue'
import { assetService } from '@/services/asset.service'

const emit = defineEmits<{ (e: 'created'): void }>()

const name = ref('')
const prompt = ref('')
const size = ref('16:9')
const creating = ref(false)
const error = ref('')
const success = ref('')

async function submit() {
  creating.value = true
  error.value = ''
  success.value = ''
  try {
    await assetService.createScenario(name.value.trim(), prompt.value.trim(), size.value)
    success.value = `Escenario "${name.value.trim()}" generado ✓`
    name.value = ''
    prompt.value = ''
    emit('created')
  } catch (e: any) {
    error.value = e?.message || 'Error generando el escenario'
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <section class="creator">
    <h2><i class="fa-solid fa-mountain-sun"></i> Generar escenario con IA</h2>
    <p class="creator__hint">
      Describe el paisaje o fondo y la IA lo crea (~$0.01) — queda guardado en tu biblioteca.
    </p>

    <label class="creator__field">
      <span>Nombre</span>
      <input v-model="name" type="text" placeholder="Ej: Malecón de Guayaquil al atardecer" />
    </label>

    <label class="creator__field">
      <span>Descripción</span>
      <textarea
        v-model="prompt"
        rows="3"
        placeholder="Cafetería moderna con plantas, luz cálida de tarde, estilo fotografía profesional…"
      ></textarea>
    </label>

    <div class="creator__sizes">
      <button
        v-for="s in ['16:9', '9:16', '1:1']"
        :key="s"
        type="button"
        class="size-pill"
        :class="{ 'is-on': size === s }"
        @click="size = s"
      >
        {{ s }}
      </button>
    </div>

    <p v-if="error" class="creator__msg is-error">
      <i class="fa-solid fa-circle-exclamation"></i>{{ error }}
    </p>
    <p v-if="success" class="creator__msg is-ok">
      <i class="fa-solid fa-circle-check"></i>{{ success }}
    </p>

    <button class="creator__go" :disabled="creating || !name.trim() || !prompt.trim()" @click="submit">
      <i :class="creating ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-wand-magic-sparkles'"></i>
      {{ creating ? 'Generando… (~20s)' : 'Generar escenario' }}
    </button>
  </section>
</template>

<style scoped lang="scss">
@use './creatorStyles.scss' as *;

.creator__sizes {
  display: flex;
  gap: 0.4rem;
}

.size-pill {
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
</style>

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

const progress = ref<number | null>(null)

async function submit() {
  creating.value = true
  error.value = ''
  success.value = ''
  progress.value = null
  const assetName = name.value.trim()
  try {
    const { taskId } = await assetService.startScenario(assetName, prompt.value.trim(), size.value)
    // polea hasta 4 minutos; el backend crea el asset al completar
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 4000))
      const st = await assetService.scenarioStatus(taskId, assetName)
      if (st.status === 'completed') {
        success.value = `Escenario "${assetName}" generado ✓`
        name.value = ''
        prompt.value = ''
        emit('created')
        return
      }
      if (st.status === 'failed') {
        error.value = st.error
        return
      }
      progress.value = st.progress ?? null
    }
    error.value = 'La generación está tardando — revisa la biblioteca en unos minutos'
  } catch (e: any) {
    error.value = e?.message || 'Error generando el escenario'
  } finally {
    creating.value = false
    progress.value = null
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
      {{ creating ? `Generando…${progress != null ? ' ' + progress + '%' : ''}` : 'Generar escenario' }}
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

<script setup lang="ts">
import { ref } from 'vue'
import { useVideoFlow } from '@/composables/useVideoFlow'
import AssetPicker from './AssetPicker.vue'

const flow = useVideoFlow()
const showAdvanced = ref(false)
</script>

<template>
  <div class="editor-body">
    <p v-if="flow.selectedModel.value" class="tip">
      <i class="fa-solid fa-lightbulb"></i>{{ flow.selectedModel.value.promptTip }}
    </p>

    <!-- 1. Escenario -->
    <AssetPicker
      v-if="flow.selectedModel.value?.supportsImage"
      asset-type="escenario"
      v-model="flow.scenarioUrl.value"
    />

    <!-- 2. Avatar -->
    <AssetPicker
      v-if="flow.selectedModel.value?.supportsImage"
      asset-type="avatar"
      v-model="flow.avatarUrl.value"
    />

    <p v-if="flow.sendPlan.value" class="plan">
      <i class="fa-solid fa-wand-magic-sparkles"></i>{{ flow.sendPlan.value }}
    </p>

    <p v-if="flow.imageMissing.value" class="warn">
      <i class="fa-solid fa-image"></i>
      {{ flow.selectedModel.value?.name }} necesita una imagen: elige o sube un avatar/escenario.
    </p>

    <!-- 3. Prompt -->
    <label class="field">
      <span class="field__label">Describe la escena</span>
      <textarea
        v-model="flow.prompt.value"
        rows="4"
        placeholder="El avatar camina por el escenario al atardecer, cámara lenta, plano cinematográfico…"
      ></textarea>
    </label>

    <!-- 4. Voz (solo modelos con audio custom) -->
    <AssetPicker
      v-if="flow.selectedModel.value?.id === 'wan2.5-preview'"
      asset-type="voz"
      v-model="flow.audioUrl.value"
    />
    <p v-else-if="flow.selectedModel.value?.supportsImage" class="voice-note">
      <i class="fa-solid fa-microphone-lines"></i>
      ¿Quieres tu propia voz en el video? Elige el modelo <strong>Wan 2.5</strong> en el paso 1.
    </p>

    <!-- Avanzado -->
    <button type="button" class="advanced-toggle" @click="showAdvanced = !showAdvanced">
      <i :class="showAdvanced ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
      Opciones avanzadas
    </button>

    <template v-if="showAdvanced">
      <label v-if="flow.selectedModel.value?.supportsImage" class="field">
        <span class="field__label">Otra imagen por URL <em class="is-opt">si no está en tu biblioteca</em></span>
        <input v-model="flow.imageUrl.value" type="url" placeholder="https://…" />
      </label>

      <label v-if="flow.selectedModel.value?.extras.includes('negativePrompt')" class="field">
        <span class="field__label">Prompt negativo <em class="is-opt">qué NO ver</em></span>
        <input v-model="flow.negativePrompt.value" type="text" placeholder="borroso, baja calidad" />
      </label>

      <div class="field-row">
        <label v-if="flow.selectedModel.value?.extras.includes('seed')" class="field field--sm">
          <span class="field__label">Seed <em class="is-opt">mismo seed ≈ mismo video</em></span>
          <input v-model.number="flow.seed.value" type="number" min="0" placeholder="aleatorio" />
        </label>

        <label v-if="flow.selectedModel.value?.extras.includes('audioToggle')" class="toggle">
          <input v-model="flow.audio.value" type="checkbox" />
          <span class="toggle__pill"></span>
          <span><i class="fa-solid fa-volume-high"></i> Audio</span>
        </label>

        <label v-if="flow.selectedModel.value?.extras.includes('promptOptimizer')" class="toggle">
          <input v-model="flow.promptOptimizer.value" type="checkbox" />
          <span class="toggle__pill"></span>
          <span><i class="fa-solid fa-wand-sparkles"></i> Optimizar prompt</span>
        </label>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use './editorFields.scss' as *;

.tip {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.76rem;
  color: $secondary-dark;
  background: $overlay-purple;
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
  line-height: 1.45;

  i { margin-top: 0.1rem; }
}

.plan {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: $BAKANO-GREEN;
  background: rgba($BAKANO-GREEN, 0.08);
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
  line-height: 1.4;

  i { margin-top: 0.1rem; }
}

.warn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: $alert-warning;
  background: $alert-warning-bg;
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
}

.voice-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.74rem;
  color: $text-secondary;
  background: rgba($primary-dark, 0.04);
  border-radius: 10px;
  padding: 0.6rem 0.8rem;

  i { color: $secondary-dark; }
}

.advanced-toggle {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  align-self: flex-start;
  font-family: $font-principal;
  font-size: 0.74rem;
  font-weight: 700;
  color: $text-secondary;
  background: none;
  border: none;
  padding: 0.2rem 0;

  &:hover { color: $primary; }
}
</style>

<script setup lang="ts">
import { useVideoFlow } from '@/composables/useVideoFlow'
import AssetPicker from './AssetPicker.vue'

const flow = useVideoFlow()
</script>

<template>
  <div class="editor-body">
    <p v-if="flow.selectedModel.value" class="tip">
      <i class="fa-solid fa-lightbulb"></i>{{ flow.selectedModel.value.promptTip }}
    </p>

    <label class="field">
      <span class="field__label">Prompt</span>
      <textarea
        v-model="flow.prompt.value"
        rows="5"
        placeholder="Un barista sirve café en cámara lenta, vapor dorado al amanecer, plano macro cinematográfico…"
      ></textarea>
    </label>

    <label v-if="flow.selectedModel.value?.supportsImage" class="field">
      <span class="field__label">
        <i class="fa-regular fa-image"></i> Imagen inicial
        <em v-if="flow.needsImage.value" class="is-req">obligatoria</em>
        <em v-else class="is-opt">opcional — anima esta imagen</em>
      </span>
      <input v-model="flow.imageUrl.value" type="url" placeholder="https://… (URL pública)" />
    </label>

    <AssetPicker
      v-if="flow.selectedModel.value?.supportsImage"
      kind="image"
      v-model="flow.imageUrl.value"
    />

    <AssetPicker
      v-if="flow.selectedModel.value?.id === 'wan2.5-preview'"
      kind="voz"
      v-model="flow.audioUrl.value"
    />

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

  i {
    margin-top: 0.1rem;
  }
}
</style>

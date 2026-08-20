<script setup lang="ts">
import { computed } from 'vue'
import { useVideoFlow } from '@/composables/useVideoFlow'

const flow = useVideoFlow()

const showAspects = computed(
  () => flow.validAspects.value.length > 1 || flow.validAspects.value[0] !== 'auto',
)
</script>

<template>
  <div class="editor-body">
    <div class="field">
      <span class="field__label">Resolución</span>
      <div class="pills">
        <button
          v-for="r in flow.validResolutions.value"
          :key="r"
          type="button"
          class="pill"
          :class="{ 'is-on': flow.resolution.value === r }"
          @click="flow.resolution.value = r"
        >
          {{ r }}
          <small>${{ (flow.selectedModel.value?.pricePerSecond[r] ?? 0).toFixed(3) }}/s</small>
        </button>
      </div>
    </div>

    <div class="field">
      <span class="field__label">Duración</span>
      <div class="pills">
        <button
          v-for="d in flow.validDurations.value"
          :key="d"
          type="button"
          class="pill"
          :class="{ 'is-on': flow.duration.value === d }"
          @click="flow.duration.value = d"
        >
          {{ d }}s
        </button>
      </div>
    </div>

    <div v-if="showAspects" class="field">
      <span class="field__label">Formato</span>
      <div class="pills">
        <button
          v-for="a in flow.validAspects.value"
          :key="a"
          type="button"
          class="pill"
          :class="{ 'is-on': flow.aspectRatio.value === a }"
          @click="flow.aspectRatio.value = a"
        >
          {{ a }}
        </button>
      </div>
    </div>

    <div class="cost">
      <span>Costo estimado</span>
      <strong>${{ flow.estimatedCost.value.toFixed(3) }}</strong>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './editorFields.scss' as *;

.cost {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba($primary, 0.06);
  border: 1px dashed rgba($primary, 0.35);
  border-radius: 12px;
  padding: 0.7rem 1rem;
  font-size: 0.82rem;
  color: $primary-dark;

  strong {
    color: $primary;
    font-size: 1.1rem;
    font-weight: 800;
  }
}
</style>

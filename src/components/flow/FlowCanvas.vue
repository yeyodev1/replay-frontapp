<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue'
import { useVideoFlow } from '@/composables/useVideoFlow'
import { useFlowCanvas, type FlowNodeId } from '@/composables/useFlowCanvas'
import FlowNodeCard from './FlowNodeCard.vue'

const emit = defineEmits<{ (e: 'open', node: 'model' | 'scene' | 'format' | 'action'): void }>()

const flow = useVideoFlow()
const canvas = useFlowCanvas()

defineExpose({ fitView: canvas.fitView, resetLayout: canvas.resetLayout })

onMounted(() => nextTick(canvas.fitView))

const sceneSummary = computed(() => {
  const p = flow.prompt.value.trim()
  if (!p) return 'Escribe el prompt'
  return p.length > 26 ? p.slice(0, 26) + '…' : p
})

const formatSummary = computed(() => {
  const parts = [flow.resolution.value, `${flow.duration.value}s`]
  if (flow.aspectRatio.value !== 'auto') parts.push(flow.aspectRatio.value)
  return parts.join(' · ')
})

const modelChip = computed(() => {
  const spec = flow.selectedModel.value
  if (!spec) return undefined
  const p = spec.pricePerSecond[flow.resolution.value] ?? Math.min(...Object.values(spec.pricePerSecond))
  return `$${p.toFixed(3)}/seg${spec.hasAudio ? ' · 🔊' : ''}`
})

function openNode(id: 'model' | 'scene' | 'format' | 'action') {
  if (canvas.draggedRecently.value) return
  emit('open', id)
}

const edges = computed<Array<{ from: FlowNodeId; to: FlowNodeId; live: boolean }>>(() => [
  { from: 'model', to: 'scene', live: flow.modelDone.value },
  { from: 'scene', to: 'format', live: flow.sceneDone.value },
  { from: 'format', to: 'action', live: flow.canSubmit.value },
])
</script>

<template>
  <div
    class="fcanvas"
    :ref="(r) => (canvas.viewport.value = r as HTMLElement)"
    @pointerdown="canvas.startPan"
    @wheel="canvas.onWheel"
  >
    <div class="fcanvas__world" :style="{ transform: canvas.worldTransform.value }">
      <svg class="fcanvas__edges" width="4000" height="3000">
        <path
          v-for="e in edges"
          :key="e.from"
          :d="canvas.edgePath(e.from, e.to)"
          class="edge"
          :class="{ 'is-live': e.live }"
        />
      </svg>

      <FlowNodeCard
        :x="canvas.positions.model.x"
        :y="canvas.positions.model.y"
        icon="fa-solid fa-bolt"
        color="green"
        eyebrow="Paso 1 · Motor"
        :title="flow.selectedModel.value?.name || 'Elige el modelo'"
        :chip="modelChip"
        :done="flow.modelDone.value"
        has-output
        @dragstart="(e) => canvas.startNodeDrag('model', e)"
        @open="openNode('model')"
      />

      <FlowNodeCard
        :x="canvas.positions.scene.x"
        :y="canvas.positions.scene.y"
        icon="fa-solid fa-message"
        color="blue"
        eyebrow="Paso 2 · Escena"
        :title="sceneSummary"
        :chip="flow.primaryImage.value ? '📷 con imagen' : undefined"
        :done="flow.sceneDone.value"
        has-input
        has-output
        @dragstart="(e) => canvas.startNodeDrag('scene', e)"
        @open="openNode('scene')"
      />

      <FlowNodeCard
        :x="canvas.positions.format.x"
        :y="canvas.positions.format.y"
        icon="fa-solid fa-sliders"
        color="purple"
        eyebrow="Paso 3 · Formato"
        :title="formatSummary"
        :chip="`$${flow.estimatedCost.value.toFixed(3)}`"
        :done="flow.formatDone.value"
        has-input
        has-output
        @dragstart="(e) => canvas.startNodeDrag('format', e)"
        @open="openNode('format')"
      />

      <FlowNodeCard
        :x="canvas.positions.action.x"
        :y="canvas.positions.action.y"
        icon="fa-solid fa-clapperboard"
        color="pink"
        eyebrow="Acción final"
        :title="flow.creating.value ? 'Enviando…' : 'Generar video'"
        :chip="`$${flow.estimatedCost.value.toFixed(3)} estimado`"
        :done="flow.canSubmit.value"
        has-input
        dark
        @dragstart="(e) => canvas.startNodeDrag('action', e)"
        @open="openNode('action')"
      />
    </div>

    <div class="fcanvas__controls" @pointerdown.stop>
      <button @click="canvas.zoomBy(1.2)" title="Acercar"><i class="fa-solid fa-plus"></i></button>
      <button @click="canvas.zoomBy(1 / 1.2)" title="Alejar"><i class="fa-solid fa-minus"></i></button>
      <button @click="canvas.fitView" title="Ajustar vista"><i class="fa-solid fa-expand"></i></button>
      <button @click="canvas.resetLayout" title="Reordenar nodos"><i class="fa-solid fa-arrows-rotate"></i></button>
    </div>

    <p class="fcanvas__hint">
      <i class="fa-solid fa-hand"></i> Arrastra los nodos · arrastra el fondo para moverte · rueda para zoom
    </p>
  </div>
</template>

<style scoped lang="scss">
.fcanvas {
  position: relative;
  flex: 1 1 auto;
  min-height: 520px;
  border-radius: 20px;
  overflow: hidden;
  cursor: grab;
  background-color: #efece6;
  background-image: radial-gradient(rgba($primary-dark, 0.14) 1.1px, transparent 1.1px);
  background-size: 20px 20px;
  border: 1px solid rgba($primary-dark, 0.06);
  touch-action: none;

  &:active {
    cursor: grabbing;
  }

  &__world {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    will-change: transform;
  }

  &__edges {
    position: absolute;
    top: 0;
    left: 0;
    overflow: visible;
    pointer-events: none;
  }

  &__controls {
    position: absolute;
    left: 14px;
    bottom: 14px;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    z-index: 5;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1px solid rgba($primary-dark, 0.12);
      background: $white;
      color: $primary-dark;
      font-size: 0.8rem;
      box-shadow: 0 3px 10px rgba($primary-dark, 0.1);

      &:hover {
        color: $primary;
        border-color: rgba($primary, 0.5);
      }
    }
  }

  &__hint {
    position: absolute;
    right: 14px;
    bottom: 14px;
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.68rem;
    font-weight: 600;
    color: $text-secondary;
    background: rgba($white, 0.85);
    border-radius: 999px;
    padding: 0.4rem 0.8rem;
    pointer-events: none;
    z-index: 5;
  }
}

.edge {
  fill: none;
  stroke: rgba($primary-dark, 0.22);
  stroke-width: 2.5;

  &.is-live {
    stroke: $BAKANO-GREEN;
    stroke-dasharray: 8 6;
    animation: edgeflow 0.9s linear infinite;
  }
}

@keyframes edgeflow {
  to {
    stroke-dashoffset: -14;
  }
}

@media (prefers-reduced-motion: reduce) {
  .edge.is-live {
    animation: none;
  }
}

@media (max-width: 720px) {
  .fcanvas {
    min-height: 68vh;
  }

  .fcanvas__hint {
    display: none;
  }

  .fcanvas__controls {
    left: 10px;
    bottom: 10px;
  }
}
</style>

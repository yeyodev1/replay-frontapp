<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { provideVideoFlow } from '@/composables/useVideoFlow'
import FlowCanvas from '@/components/flow/FlowCanvas.vue'
import NodeDrawer from '@/components/flow/NodeDrawer.vue'
import ModelEditor from '@/components/flow/ModelEditor.vue'
import SceneEditor from '@/components/flow/SceneEditor.vue'
import FormatEditor from '@/components/flow/FormatEditor.vue'

type NodeId = 'model' | 'scene' | 'format' | 'action'

const flow = provideVideoFlow()
const drawer = ref<NodeId | null>(null)

const drawerMeta: Record<string, { icon: string; color: string; eyebrow: string; title: string }> = {
  model: { icon: 'fa-solid fa-bolt', color: 'green', eyebrow: 'Paso 1 · Motor', title: 'Elige el modelo de IA' },
  scene: { icon: 'fa-solid fa-message', color: 'blue', eyebrow: 'Paso 2 · Escena', title: 'Describe la escena' },
  format: { icon: 'fa-solid fa-sliders', color: 'purple', eyebrow: 'Paso 3 · Formato', title: 'Formato y duración' },
}

const actionNotice = ref('')

const meta = computed(() => (drawer.value && drawer.value !== 'action' ? drawerMeta[drawer.value] : null))

async function onOpen(node: NodeId) {
  actionNotice.value = ''
  if (node !== 'action') {
    drawer.value = node
    return
  }
  // Nodo de acción: ejecuta si el flujo está completo, si no abre el paso que falta
  if (flow.canSubmit.value) {
    await flow.submit()
    return
  }
  if (!flow.modelDone.value) drawer.value = 'model'
  else if (!flow.sceneDone.value) {
    drawer.value = 'scene'
    actionNotice.value = flow.imageMissing.value
      ? `${flow.selectedModel.value?.name} requiere una imagen inicial`
      : 'Falta el prompt de la escena'
  } else drawer.value = 'format'
}

onMounted(flow.init)
</script>

<template>
  <div class="gen">
    <header class="gen__head">
      <div>
        <h1><i class="fa-solid fa-diagram-project"></i> Flujo de video</h1>
        <p>Arma tu flujo como en n8n: arrastra los nodos, haz clic para configurarlos y ejecuta</p>
      </div>

      <Transition name="pop">
        <router-link v-if="flow.lastCreatedId.value" to="/videos" class="gen__done">
          <i class="fa-solid fa-circle-check"></i> ¡Video en marcha! Ver en Mis videos →
        </router-link>
      </Transition>
    </header>

    <p v-if="flow.replicated.value" class="gen__banner gen__banner--purple">
      <i class="fa-solid fa-clone"></i>
      Flujo replicado de un video anterior — todo precargado, haz clic en Generar video.
    </p>

    <p v-if="actionNotice" class="gen__banner gen__banner--warn">
      <i class="fa-solid fa-triangle-exclamation"></i>{{ actionNotice }}
    </p>

    <p v-if="flow.error.value" class="gen__banner gen__banner--error">
      <i class="fa-solid fa-circle-exclamation"></i>{{ flow.error.value }}
    </p>

    <div class="gen__stage">
      <FlowCanvas @open="onOpen" />

      <NodeDrawer
        :open="!!meta"
        :icon="meta?.icon ?? ''"
        :color="meta?.color ?? 'green'"
        :eyebrow="meta?.eyebrow ?? ''"
        :title="meta?.title ?? ''"
        @close="drawer = null"
      >
        <ModelEditor v-if="drawer === 'model'" />
        <SceneEditor v-else-if="drawer === 'scene'" />
        <FormatEditor v-else-if="drawer === 'format'" />
      </NodeDrawer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gen {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.6rem 2rem 2rem;
  flex: 1 1 auto;

  &__head {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;

    h1 {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.4rem;
      font-weight: 800;
      color: $primary-dark;

      i {
        color: $primary;
      }
    }

    p {
      font-size: 0.84rem;
      color: $text-secondary;
      margin-top: 0.2rem;
    }
  }

  &__done {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
    font-size: 0.82rem;
    font-weight: 700;
    color: $BAKANO-GREEN;
    background: rgba($BAKANO-GREEN, 0.12);
    border-radius: 999px;
    padding: 0.55rem 1rem;
    text-decoration: none;
  }

  &__banner {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    align-self: flex-start;
    font-size: 0.82rem;
    font-weight: 600;
    border-radius: 12px;
    padding: 0.7rem 1rem;

    &--purple {
      color: $secondary-dark;
      background: $overlay-purple;
    }

    &--warn {
      color: $alert-warning;
      background: $alert-warning-bg;
    }

    &--error {
      color: $alert-error;
      background: $alert-error-bg;
    }
  }

  &__stage {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    min-height: 540px;
    overflow: hidden;
    border-radius: 20px;
  }
}

.pop-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.pop-enter-from {
  opacity: 0;
  transform: scale(0.94);
}

@media (max-width: 720px) {
  .gen {
    padding: 1.1rem 1rem 1.5rem;
  }
}
</style>

import { computed, provide, inject, ref, watch, type InjectionKey } from 'vue'
import { storeToRefs } from 'pinia'
import { useVideosStore } from '@/stores/videos'
import type { VideoModelSpec } from '@/types/video'

export type FlowNode = 'model' | 'scene' | 'format'

export function createVideoFlow() {
  const store = useVideosStore()
  const { catalog, creating, error } = storeToRefs(store)

  const prompt = ref('')
  const modelId = ref('')
  const resolution = ref('')
  const duration = ref(0)
  const aspectRatio = ref('16:9')
  const imageUrl = ref('')
  const scenarioUrl = ref('')
  const avatarUrl = ref('')
  const audioUrl = ref('')
  const negativePrompt = ref('')
  const seed = ref<number | null>(null)
  const audio = ref(true)
  const promptOptimizer = ref(true)
  const lastCreatedId = ref('')
  const replicated = ref(false)
  const openNode = ref<FlowNode | null>('model')

  const selectedModel = computed<VideoModelSpec | undefined>(() =>
    catalog.value?.models.find((m) => m.id === modelId.value),
  )

  const validResolutions = computed(() => selectedModel.value?.resolutions ?? [])

  const validDurations = computed(() => {
    const spec = selectedModel.value
    if (!spec) return []
    return spec.durationByResolution?.[resolution.value] ?? spec.durations
  })

  const validAspects = computed(() => {
    const spec = selectedModel.value
    if (!spec) return []
    return spec.aspectsByResolution?.[resolution.value] ?? spec.aspectRatios
  })

  const estimatedCost = computed(() => {
    const spec = selectedModel.value
    if (!spec) return 0
    return (spec.pricePerSecond[resolution.value] ?? 0) * duration.value
  })

  const needsImage = computed(() => !!selectedModel.value?.requiresImage)

  /** Imagen principal: avatar > escenario > URL manual (asi la esperan los modelos de 1 imagen) */
  const primaryImage = computed(() => {
    for (const u of [avatarUrl.value, scenarioUrl.value, imageUrl.value]) {
      if (/^https?:\/\//.test(u)) return u
    }
    return ''
  })

  /** Lista de imagenes segun el contrato del modelo elegido */
  const effectiveImageUrls = computed<string[]>(() => {
    const spec = selectedModel.value
    if (!spec || !primaryImage.value) return []
    if (spec.id === 'sora-2') {
      // sora-2 acepta varias imagenes de referencia: avatar + escenario
      return [avatarUrl.value, scenarioUrl.value, imageUrl.value]
        .filter((u) => /^https?:\/\//.test(u))
        .slice(0, 2)
    }
    return [primaryImage.value]
  })

  /** Explica en una frase como se enviaran los recursos al modelo */
  const sendPlan = computed(() => {
    const spec = selectedModel.value
    if (!spec) return ''
    const hasAvatar = /^https?:\/\//.test(avatarUrl.value)
    const hasScenario = /^https?:\/\//.test(scenarioUrl.value)
    if (!hasAvatar && !hasScenario) return ''
    if (spec.id === 'sora-2' && hasAvatar && hasScenario)
      return 'Avatar y escenario van juntos como imagenes de referencia.'
    if (hasAvatar && hasScenario)
      return `${spec.name} acepta 1 imagen: va el avatar como imagen inicial y el escenario se describe en el prompt.`
    return hasAvatar
      ? 'El avatar va como imagen inicial del video.'
      : 'El escenario va como imagen inicial del video.'
  })

  const imageMissing = computed(() => needsImage.value && !primaryImage.value)

  const modelDone = computed(() => !!selectedModel.value)
  const sceneDone = computed(() => !!prompt.value.trim() && !imageMissing.value)
  const formatDone = computed(
    () => modelDone.value && !!resolution.value && duration.value > 0,
  )
  const canSubmit = computed(
    () => modelDone.value && sceneDone.value && formatDone.value && !creating.value,
  )

  function toggleNode(node: FlowNode) {
    openNode.value = openNode.value === node ? null : node
  }

  function selectModel(spec: VideoModelSpec) {
    modelId.value = spec.id
    openNode.value = 'scene'
  }

  watch(selectedModel, (spec) => {
    if (!spec) return
    if (!spec.resolutions.includes(resolution.value))
      resolution.value = spec.defaultResolution
    if (!validDurations.value.includes(duration.value)) duration.value = spec.defaultDuration
    if (!validAspects.value.includes(aspectRatio.value))
      aspectRatio.value = validAspects.value[0] ?? '16:9'
  })

  watch(resolution, () => {
    if (!validDurations.value.includes(duration.value))
      duration.value = validDurations.value[0] ?? 5
    if (!validAspects.value.includes(aspectRatio.value))
      aspectRatio.value = validAspects.value[0] ?? '16:9'
  })

  async function submit() {
    if (!canSubmit.value || !selectedModel.value) return
    const spec = selectedModel.value
    const job = await store.createVideo({
      prompt: prompt.value.trim(),
      model: spec.id,
      resolution: resolution.value,
      aspectRatio: aspectRatio.value,
      duration: duration.value,
      imageUrls: effectiveImageUrls.value,
      options: {
        audioUrl:
          spec.id === 'wan2.5-preview' && /^https?:\/\//.test(audioUrl.value)
            ? audioUrl.value
            : undefined,
        negativePrompt: negativePrompt.value.trim() || undefined,
        seed: seed.value ?? undefined,
        audio: spec.extras.includes('audioToggle') ? audio.value : undefined,
        promptOptimizer: spec.extras.includes('promptOptimizer')
          ? promptOptimizer.value
          : undefined,
      },
    })
    lastCreatedId.value = job._id
  }

  async function init() {
    await store.fetchCatalog()
    const pre = store.consumePrefill()
    if (pre && catalog.value?.models.some((m) => m.id === pre.model)) {
      modelId.value = pre.model
      prompt.value = pre.prompt
      resolution.value = pre.resolution
      duration.value = pre.duration
      aspectRatio.value = pre.aspectRatio
      avatarUrl.value = pre.imageUrls?.[0] ?? ''
      scenarioUrl.value = pre.imageUrls?.[1] ?? ''
      imageUrl.value = ''
      audioUrl.value = pre.options?.audioUrl ?? ''
      negativePrompt.value = pre.options?.negativePrompt ?? ''
      seed.value = pre.options?.seed ?? null
      if (pre.options?.audio !== undefined) audio.value = pre.options.audio
      if (pre.options?.promptOptimizer !== undefined)
        promptOptimizer.value = pre.options.promptOptimizer
      replicated.value = true
      openNode.value = null
    } else if (catalog.value) {
      modelId.value = catalog.value.defaultModel
      openNode.value = 'model'
    }
  }

  return {
    catalog,
    creating,
    error,
    prompt,
    modelId,
    resolution,
    duration,
    aspectRatio,
    imageUrl,
    scenarioUrl,
    avatarUrl,
    audioUrl,
    primaryImage,
    sendPlan,
    negativePrompt,
    seed,
    audio,
    promptOptimizer,
    lastCreatedId,
    replicated,
    openNode,
    selectedModel,
    validResolutions,
    validDurations,
    validAspects,
    estimatedCost,
    needsImage,
    imageMissing,
    modelDone,
    sceneDone,
    formatDone,
    canSubmit,
    toggleNode,
    selectModel,
    submit,
    init,
  }
}

export type VideoFlow = ReturnType<typeof createVideoFlow>

export const VideoFlowKey: InjectionKey<VideoFlow> = Symbol('videoFlow')

export function provideVideoFlow(): VideoFlow {
  const flow = createVideoFlow()
  provide(VideoFlowKey, flow)
  return flow
}

export function useVideoFlow(): VideoFlow {
  const flow = inject(VideoFlowKey)
  if (!flow) throw new Error('useVideoFlow debe usarse dentro de GeneratorView')
  return flow
}

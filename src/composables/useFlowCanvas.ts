import { reactive, ref, computed } from 'vue'

export type FlowNodeId = 'model' | 'scene' | 'format' | 'action'

export interface NodePos {
  x: number
  y: number
}

export const NODE_W = 280
export const NODE_H = 96

const STORAGE_KEY = 'replay-flow-layout-v1'

/** Layout por defecto: zigzag horizontal estilo n8n */
const DEFAULT_POSITIONS: Record<FlowNodeId, NodePos> = {
  model: { x: 60, y: 90 },
  scene: { x: 430, y: 260 },
  format: { x: 800, y: 90 },
  action: { x: 1170, y: 260 },
}

export function useFlowCanvas() {
  const positions = reactive<Record<FlowNodeId, NodePos>>(loadPositions())
  const scale = ref(1)
  const tx = ref(0)
  const ty = ref(0)
  const viewport = ref<HTMLElement | null>(null)

  /** true mientras se arrastra un nodo (evita que el click abra el editor) */
  const draggedRecently = ref(false)

  function loadPositions(): Record<FlowNodeId, NodePos> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        return { ...structuredClone(DEFAULT_POSITIONS), ...saved }
      }
    } catch {
      /* layout corrupto: usar defaults */
    }
    return structuredClone(DEFAULT_POSITIONS)
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
  }

  function resetLayout() {
    Object.assign(positions, structuredClone(DEFAULT_POSITIONS))
    persist()
    fitView()
  }

  function startNodeDrag(id: FlowNodeId, e: PointerEvent) {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const orig = { ...positions[id] }
    let moved = false

    function onMove(ev: PointerEvent) {
      const dx = (ev.clientX - startX) / scale.value
      const dy = (ev.clientY - startY) / scale.value
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true
      positions[id] = { x: orig.x + dx, y: orig.y + dy }
    }

    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      if (moved) {
        persist()
        draggedRecently.value = true
        setTimeout(() => (draggedRecently.value = false), 50)
      }
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  function startPan(e: PointerEvent) {
    if (e.button !== 0) return
    const startX = e.clientX
    const startY = e.clientY
    const origTx = tx.value
    const origTy = ty.value

    function onMove(ev: PointerEvent) {
      tx.value = origTx + (ev.clientX - startX)
      ty.value = origTy + (ev.clientY - startY)
    }

    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault()
    const rect = viewport.value?.getBoundingClientRect()
    if (!rect) return
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
    const next = Math.min(1.6, Math.max(0.35, scale.value * factor))
    const real = next / scale.value
    // zoom centrado en el cursor
    tx.value = cx - (cx - tx.value) * real
    ty.value = cy - (cy - ty.value) * real
    scale.value = next
  }

  function zoomBy(factor: number) {
    const rect = viewport.value?.getBoundingClientRect()
    const cx = (rect?.width ?? 800) / 2
    const cy = (rect?.height ?? 500) / 2
    const next = Math.min(1.6, Math.max(0.35, scale.value * factor))
    const real = next / scale.value
    tx.value = cx - (cx - tx.value) * real
    ty.value = cy - (cy - ty.value) * real
    scale.value = next
  }

  function fitView() {
    const rect = viewport.value?.getBoundingClientRect()
    if (!rect) return
    const xs = Object.values(positions)
    const minX = Math.min(...xs.map((p) => p.x)) - 40
    const minY = Math.min(...xs.map((p) => p.y)) - 40
    const maxX = Math.max(...xs.map((p) => p.x)) + NODE_W + 40
    const maxY = Math.max(...xs.map((p) => p.y)) + NODE_H + 80
    const fitScale = Math.min(1, rect.width / (maxX - minX), rect.height / (maxY - minY))
    // nunca encoger tanto que los nodos se vuelvan ilegibles
    scale.value = Math.min(1, Math.max(0.72, fitScale))
    tx.value = (rect.width - (maxX - minX) * scale.value) / 2 - minX * scale.value
    ty.value = (rect.height - (maxY - minY) * scale.value) / 2 - minY * scale.value
  }

  const worldTransform = computed(
    () => `translate(${tx.value}px, ${ty.value}px) scale(${scale.value})`,
  )

  /** Curva bezier horizontal entre el puerto de salida de `from` y el de entrada de `to` */
  function edgePath(from: FlowNodeId, to: FlowNodeId, fromH = NODE_H, toH = NODE_H): string {
    const a = positions[from]
    const b = positions[to]
    const x1 = a.x + NODE_W
    const y1 = a.y + fromH / 2
    const x2 = b.x
    const y2 = b.y + toH / 2
    const dx = Math.max(60, Math.abs(x2 - x1) / 2)
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
  }

  return {
    positions,
    scale,
    tx,
    ty,
    viewport,
    draggedRecently,
    worldTransform,
    startNodeDrag,
    startPan,
    onWheel,
    zoomBy,
    fitView,
    resetLayout,
    edgePath,
  }
}

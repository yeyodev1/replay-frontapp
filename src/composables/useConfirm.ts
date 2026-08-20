import { reactive } from 'vue'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  /** true = acción destructiva (botón rojo) */
  danger?: boolean
  icon?: string
}

const state = reactive({
  open: false,
  title: '',
  message: '',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  danger: false,
  icon: 'fa-solid fa-circle-question',
})

let resolver: ((value: boolean) => void) | null = null

/** Modal de confirmación global (reemplaza a confirm() nativo). */
export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    state.title = options.title
    state.message = options.message
    state.confirmLabel = options.confirmLabel ?? 'Confirmar'
    state.cancelLabel = options.cancelLabel ?? 'Cancelar'
    state.danger = options.danger ?? false
    state.icon =
      options.icon ?? (options.danger ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-question')
    state.open = true
    return new Promise((resolve) => {
      resolver = resolve
    })
  }

  function settle(value: boolean) {
    state.open = false
    resolver?.(value)
    resolver = null
  }

  return { state, confirm, settle }
}

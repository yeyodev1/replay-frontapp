import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { videoService } from '@/services/video.service'
import type { CreateVideoInput, VideoCatalog, VideoJob } from '@/types/video'

const POLL_INTERVAL_MS = 8000

export const useVideosStore = defineStore('videos', () => {
  const jobs = ref<VideoJob[]>([])
  const catalog = ref<VideoCatalog | null>(null)
  const loading = ref(false)
  const creating = ref(false)
  const error = ref('')
  /** Job a replicar: el generador lo consume al montar */
  const prefill = ref<VideoJob | null>(null)

  function setPrefill(job: VideoJob) {
    prefill.value = job
  }

  function consumePrefill(): VideoJob | null {
    const p = prefill.value
    prefill.value = null
    return p
  }
  let pollTimer: ReturnType<typeof setInterval> | null = null

  const activeJobs = computed(() =>
    jobs.value.filter((j) => j.status === 'pending' || j.status === 'processing'),
  )

  async function fetchCatalog() {
    if (catalog.value) return
    catalog.value = await videoService.getCatalog()
  }

  async function fetchJobs() {
    loading.value = true
    try {
      jobs.value = await videoService.listVideos()
    } catch (e: any) {
      error.value = e?.message || 'Error cargando videos'
    } finally {
      loading.value = false
    }
    syncPolling()
  }

  async function createVideo(input: CreateVideoInput) {
    creating.value = true
    error.value = ''
    try {
      const job = await videoService.createVideo(input)
      jobs.value.unshift(job)
      syncPolling()
      return job
    } catch (e: any) {
      error.value = e?.message || 'Error creando el video'
      throw e
    } finally {
      creating.value = false
    }
  }

  async function refreshJob(id: string) {
    try {
      const updated = await videoService.getVideo(id)
      const idx = jobs.value.findIndex((j) => j._id === id)
      if (idx !== -1) jobs.value[idx] = updated
    } catch {
      // el sweeper del backend sigue intentando; no romper el polling por un fallo puntual
    }
  }

  async function deleteVideo(id: string) {
    await videoService.deleteVideo(id)
    jobs.value = jobs.value.filter((j) => j._id !== id)
    syncPolling()
  }

  function syncPolling() {
    if (activeJobs.value.length > 0 && !pollTimer) {
      pollTimer = setInterval(async () => {
        await Promise.all(activeJobs.value.map((j) => refreshJob(j._id)))
        if (activeJobs.value.length === 0) stopPolling()
      }, POLL_INTERVAL_MS)
    } else if (activeJobs.value.length === 0) {
      stopPolling()
    }
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  return {
    jobs,
    catalog,
    loading,
    creating,
    error,
    activeJobs,
    fetchCatalog,
    fetchJobs,
    createVideo,
    deleteVideo,
    stopPolling,
    setPrefill,
    consumePrefill,
  }
})

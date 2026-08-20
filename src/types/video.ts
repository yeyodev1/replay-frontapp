export type VideoJobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface VideoJobOptions {
  negativePrompt?: string
  seed?: number
  audio?: boolean
  promptOptimizer?: boolean
  audioUrl?: string
}

export interface VideoJob {
  _id: string
  prompt: string
  model: string
  modelName: string
  resolution: string
  aspectRatio: string
  duration: number
  imageUrls: string[]
  options?: VideoJobOptions
  status: VideoJobStatus
  taskId: string
  videoUrl?: string
  error?: string
  progress?: number
  estimatedCostUsd: number
  actualCostUsd?: number
  createdAt: string
  updatedAt: string
}

export type ModelExtra = 'negativePrompt' | 'seed' | 'audioToggle' | 'promptOptimizer'

export interface VideoModelSpec {
  id: string
  name: string
  tagline: string
  tier: 'economico' | 'equilibrado' | 'audio' | 'premium'
  hasAudio: boolean
  supportsImage: boolean
  requiresImage: boolean
  durations: number[]
  defaultDuration: number
  resolutions: string[]
  defaultResolution: string
  aspectRatios: string[]
  durationByResolution?: Record<string, number[]>
  aspectsByResolution?: Record<string, string[]>
  extras: ModelExtra[]
  features: string[]
  promptTip: string
  pricePerSecond: Record<string, number>
}

export interface VideoCatalog {
  models: VideoModelSpec[]
  defaultModel: string
}

export interface CreateVideoInput {
  prompt: string
  model: string
  resolution: string
  aspectRatio: string
  duration: number
  imageUrls?: string[]
  options?: VideoJobOptions
}

export interface AccountBalance {
  remainUsd: number
  usedUsd: number
  remainCredits: number
  usedCredits: number
}

export interface SpendStats {
  balance: AccountBalance | null
  totals: {
    videos: number
    completed: number
    failed: number
    spentUsd: number
    spentLast30Usd: number
    secondsGenerated: number
    avgCostUsd: number
  }
  byModel: Array<{ model: string; name: string; count: number; spentUsd: number; seconds: number }>
  recent: Array<{
    _id: string
    prompt: string
    modelName: string
    status: VideoJobStatus
    estimatedCostUsd: number
    actualCostUsd?: number
    duration: number
    resolution: string
    createdAt: string
  }>
}

export type AssetType = 'escenario' | 'avatar' | 'perspectiva' | 'voz' | 'otro'

export interface Asset {
  _id: string
  name: string
  type: AssetType
  url: string
  publicId: string
  resourceType: string
  bytes?: number
  format?: string
  duration?: number
  createdAt: string
}

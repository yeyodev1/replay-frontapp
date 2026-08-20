import APIBase from './httpBase'
import type { CreateVideoInput, SpendStats, VideoCatalog, VideoJob } from '@/types/video'

class VideoService extends APIBase {
  async getCatalog(): Promise<VideoCatalog> {
    const { data } = await this.get<VideoCatalog>('videos/models')
    return data
  }

  async createVideo(input: CreateVideoInput): Promise<VideoJob> {
    const { data } = await this.post<VideoJob>('videos', input)
    return data
  }

  async listVideos(): Promise<VideoJob[]> {
    const { data } = await this.get<VideoJob[]>('videos')
    return data
  }

  async getVideo(id: string): Promise<VideoJob> {
    const { data } = await this.get<VideoJob>(`videos/${id}`)
    return data
  }

  async deleteVideo(id: string): Promise<void> {
    await this.delete(`videos/${id}`)
  }

  async getStats(): Promise<SpendStats> {
    const { data } = await this.get<SpendStats>('videos/stats')
    return data
  }
}

export const videoService = new VideoService()

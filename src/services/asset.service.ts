import APIBase from './httpBase'
import type { Asset, AssetType } from '@/types/video'

class AssetService extends APIBase {
  async list(type?: AssetType): Promise<Asset[]> {
    const { data } = await this.get<Asset[]>(type ? `assets?type=${type}` : 'assets')
    return data
  }

  /** file: data URI base64 o URL pública */
  async create(name: string, type: AssetType, file: string): Promise<Asset> {
    const { data } = await this.post<Asset>('assets', { name, type, file })
    return data
  }

  async remove(id: string): Promise<void> {
    await this.delete(`assets/${id}`)
  }

  async createVoice(name: string, text: string, voice: string, speed: number): Promise<Asset> {
    const { data } = await this.post<Asset>('assets/voice', { name, text, voice, speed })
    return data
  }

  async createScenario(name: string, prompt: string, size: string): Promise<Asset> {
    const { data } = await this.post<Asset>('assets/scenario', { name, prompt, size })
    return data
  }
}

export const assetService = new AssetService()

export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsDataURL(file)
  })
}

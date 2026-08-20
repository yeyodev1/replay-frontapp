<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { assetService } from '@/services/asset.service'
import type { Asset } from '@/types/video'
import AssetUploadForm from '@/components/assets/AssetUploadForm.vue'
import AssetGallery from '@/components/assets/AssetGallery.vue'
import VoiceCreator from '@/components/assets/VoiceCreator.vue'
import ScenarioCreator from '@/components/assets/ScenarioCreator.vue'
import { useConfirm } from '@/composables/useConfirm'

const { confirm } = useConfirm()
const assets = ref<Asset[]>([])
const loading = ref(false)
const error = ref('')

async function fetchAssets() {
  loading.value = true
  error.value = ''
  try {
    assets.value = await assetService.list()
  } catch (e: any) {
    error.value = e?.message || 'Error cargando la biblioteca'
  } finally {
    loading.value = false
  }
}

async function removeAsset(a: Asset) {
  const ok = await confirm({
    title: 'Eliminar recurso',
    message: `"${a.name}" se borrará de la biblioteca y de Cloudinary.`,
    confirmLabel: 'Eliminar',
    danger: true,
  })
  if (!ok) return
  try {
    await assetService.remove(a._id)
    await fetchAssets()
  } catch (e: any) {
    error.value = e?.message || 'Error eliminando el recurso'
  }
}

onMounted(fetchAssets)
</script>

<template>
  <div class="resources">
    <header class="resources__head">
      <h1><i class="fa-solid fa-box-archive"></i> Recursos</h1>
      <p>
        Tu biblioteca de referencias: escenarios, avatars, perspectivas y voces.
        Se usan directo en el generador para lograr el mejor resultado.
      </p>
    </header>

    <p v-if="error" class="resources__error">
      <i class="fa-solid fa-circle-exclamation"></i>{{ error }}
    </p>

    <main class="resources__main">
      <div class="resources__col">
        <AssetUploadForm @created="fetchAssets" />
        <VoiceCreator @created="fetchAssets" />
        <ScenarioCreator @created="fetchAssets" />
      </div>
      <AssetGallery :assets="assets" :loading="loading" @delete="removeAsset" />
    </main>
  </div>
</template>

<style scoped lang="scss">
.resources {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 1.8rem 2rem 3rem;

  &__head {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    h1 {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.4rem;
      font-weight: 800;
      color: $primary-dark;

      i { color: $primary; }
    }

    p {
      font-size: 0.84rem;
      color: $text-secondary;
      max-width: 640px;
    }
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    color: $alert-error;
    background: $alert-error-bg;
    border-radius: 10px;
    padding: 0.7rem 1rem;
  }

  &__main {
    display: flex;
    align-items: flex-start;
    gap: 1.4rem;
    flex-wrap: wrap;
  }

  &__col {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    flex: 0 1 340px;
    min-width: 280px;
  }
}

@media (max-width: 720px) {
  .resources {
    padding: 1.2rem 1.1rem 2.5rem;
  }
}
</style>

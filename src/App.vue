<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ConfirmModal from '@/components/ConfirmModal.vue'

const router = useRouter()
const userStore = useUserStore()

function onTokenExpired() {
  userStore.logout()
  router.push('/login')
}

onMounted(() => {
  window.addEventListener('auth:token-expired', onTokenExpired)
  if (userStore.isAuthenticated) userStore.fetchMe()
})

onBeforeUnmount(() => {
  window.removeEventListener('auth:token-expired', onTokenExpired)
})
</script>

<template>
  <div class="app-container">
    <RouterView />
    <ConfirmModal />
  </div>
</template>

<style lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

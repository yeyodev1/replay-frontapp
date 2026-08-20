import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type PublicUser } from '@/services/auth.service'

const TOKEN_KEY = 'access_token'

export const useUserStore = defineStore('user', () => {
  const user = ref<PublicUser | null>(null)
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const result = await authService.login(email, password)
    token.value = result.token
    user.value = result.user
    localStorage.setItem(TOKEN_KEY, result.token)
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      user.value = await authService.me()
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return { user, token, isAuthenticated, login, fetchMe, logout }
})

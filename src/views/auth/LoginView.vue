<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import logoDark from '@/assets/logos/bakano-dark.png'
import teamImage from '@/assets/auth/equipo-trabajo.webp'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await userStore.login(email.value.trim(), password.value)
    router.push('/')
  } catch (e: any) {
    error.value = e?.message || 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth">
    <aside class="auth__visual">
      <img :src="teamImage" alt="Equipo Bakano" />
      <div class="auth__visual-text">
        <h2>Replay</h2>
        <p>Genera videos increíbles con IA para tus marcas — rápido, barato y con calidad Bakano.</p>
      </div>
    </aside>

    <main class="auth__panel">
      <div class="auth__card">
        <img :src="logoDark" alt="Bakano" class="auth__logo" />

        <div class="auth__title">
          <h1>Bienvenido de vuelta</h1>
          <p>Inicia sesión para crear tus videos</p>
        </div>

        <form class="auth__form" @submit.prevent="submit">
          <div class="auth__field">
            <label for="email">Email</label>
            <div class="auth__input">
              <i class="fa-solid fa-envelope"></i>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="tu@bakano.ec"
                autocomplete="email"
                required
              />
            </div>
          </div>

          <div class="auth__field">
            <label for="password">Contraseña</label>
            <div class="auth__input">
              <i class="fa-solid fa-lock"></i>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
              <button type="button" @click="showPassword = !showPassword" tabindex="-1">
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <p v-if="error" class="auth__error">
            <i class="fa-solid fa-circle-exclamation"></i>{{ error }}
          </p>

          <button type="submit" class="auth__submit" :disabled="loading">
            <i class="fa-solid fa-right-to-bracket"></i>
            {{ loading ? 'Entrando…' : 'Iniciar sesión' }}
          </button>
        </form>

        <div class="auth__links">
          <router-link to="/forgot-password">¿Olvidaste tu contraseña?</router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
@use './authStyles.scss' as *;

</style>

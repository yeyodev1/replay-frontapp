<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import logoDark from '@/assets/logos/bakano-dark.png'
import teamImage from '@/assets/auth/equipo-trabajo.webp'

const route = useRoute()
const router = useRouter()

const token = computed(() => String(route.query.token || ''))
const password = ref('')
const confirm = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const done = ref(false)

async function submit() {
  error.value = ''
  if (password.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }
  if (password.value !== confirm.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  loading.value = true
  try {
    await authService.resetPassword(token.value, password.value)
    done.value = true
    setTimeout(() => router.push('/login'), 2500)
  } catch (e: any) {
    error.value = e?.message || 'El enlace es inválido o expiró'
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
        <h2>Nueva contraseña</h2>
        <p>Un paso más y vuelves a crear videos con Replay.</p>
      </div>
    </aside>

    <main class="auth__panel">
      <div class="auth__card">
        <img :src="logoDark" alt="Bakano" class="auth__logo" />

        <div class="auth__title">
          <h1>Crea tu nueva contraseña</h1>
          <p>Mínimo 8 caracteres</p>
        </div>

        <p v-if="done" class="auth__success">
          <i class="fa-solid fa-circle-check"></i>
          Contraseña actualizada. Redirigiendo al login…
        </p>

        <p v-else-if="!token" class="auth__error">
          <i class="fa-solid fa-circle-exclamation"></i>
          Enlace inválido — solicita uno nuevo desde "¿Olvidaste tu contraseña?".
        </p>

        <form v-else class="auth__form" @submit.prevent="submit">
          <div class="auth__field">
            <label for="password">Nueva contraseña</label>
            <div class="auth__input">
              <i class="fa-solid fa-lock"></i>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="new-password"
                required
              />
              <button type="button" @click="showPassword = !showPassword" tabindex="-1">
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="auth__field">
            <label for="confirm">Repite la contraseña</label>
            <div class="auth__input">
              <i class="fa-solid fa-lock"></i>
              <input
                id="confirm"
                v-model="confirm"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="new-password"
                required
              />
            </div>
          </div>

          <p v-if="error" class="auth__error">
            <i class="fa-solid fa-circle-exclamation"></i>{{ error }}
          </p>

          <button type="submit" class="auth__submit" :disabled="loading">
            <i class="fa-solid fa-key"></i>
            {{ loading ? 'Guardando…' : 'Guardar contraseña' }}
          </button>
        </form>

        <div class="auth__links">
          <router-link to="/login"><i class="fa-solid fa-arrow-left"></i> Volver al login</router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
@use './authStyles.scss' as *;
</style>

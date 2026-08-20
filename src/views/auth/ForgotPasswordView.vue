<script setup lang="ts">
import { ref } from 'vue'
import { authService } from '@/services/auth.service'
import logoDark from '@/assets/logos/bakano-dark.png'
import teamImage from '@/assets/auth/equipo-reunion.webp'

const email = ref('')
const loading = ref(false)
const sent = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await authService.forgotPassword(email.value.trim())
    sent.value = true
  } catch (e: any) {
    error.value = e?.message || 'No pudimos enviar el correo, intenta de nuevo'
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
        <h2>Recupera tu acceso</h2>
        <p>Te enviamos un enlace seguro a tu correo para crear una contraseña nueva.</p>
      </div>
    </aside>

    <main class="auth__panel">
      <div class="auth__card">
        <img :src="logoDark" alt="Bakano" class="auth__logo" />

        <div class="auth__title">
          <h1>¿Olvidaste tu contraseña?</h1>
          <p>Ingresa tu email y te mandamos el enlace de recuperación</p>
        </div>

        <p v-if="sent" class="auth__success">
          <i class="fa-solid fa-paper-plane"></i>
          Enviado — revisa tu bandeja de entrada (y spam). El enlace expira en 1 hora.
        </p>

        <form v-else class="auth__form" @submit.prevent="submit">
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

          <p v-if="error" class="auth__error">
            <i class="fa-solid fa-circle-exclamation"></i>{{ error }}
          </p>

          <button type="submit" class="auth__submit" :disabled="loading">
            <i class="fa-solid fa-paper-plane"></i>
            {{ loading ? 'Enviando…' : 'Enviar enlace' }}
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

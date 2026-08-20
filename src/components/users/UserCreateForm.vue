<script setup lang="ts">
import { ref } from 'vue'
import { authService } from '@/services/auth.service'

const emit = defineEmits<{ (e: 'created'): void }>()

const name = ref('')
const email = ref('')
const password = ref('')
const creating = ref(false)
const error = ref('')
const success = ref('')

async function createUser() {
  creating.value = true
  error.value = ''
  success.value = ''
  try {
    await authService.createUser(name.value.trim(), email.value.trim(), password.value)
    success.value = `Usuario ${email.value.trim()} creado ✓`
    name.value = ''
    email.value = ''
    password.value = ''
    emit('created')
  } catch (e: any) {
    error.value = e?.message || 'Error creando usuario'
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <section class="panel">
    <h2 class="panel__title"><i class="fa-solid fa-user-plus"></i> Crear usuario</h2>

    <form class="form" @submit.prevent="createUser">
      <label class="form__field">
        <span class="form__label">Nombre</span>
        <div class="form__input">
          <i class="fa-solid fa-user"></i>
          <input v-model="name" type="text" placeholder="Nombre completo" required />
        </div>
      </label>

      <label class="form__field">
        <span class="form__label">Email</span>
        <div class="form__input">
          <i class="fa-solid fa-envelope"></i>
          <input v-model="email" type="email" placeholder="nuevo@bakano.ec" required />
        </div>
      </label>

      <label class="form__field">
        <span class="form__label">Contraseña</span>
        <div class="form__input">
          <i class="fa-solid fa-lock"></i>
          <input
            v-model="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            minlength="8"
            required
          />
        </div>
      </label>

      <p v-if="error" class="form__alert form__alert--error">
        <i class="fa-solid fa-circle-exclamation"></i>{{ error }}
      </p>
      <p v-if="success" class="form__alert form__alert--success">
        <i class="fa-solid fa-circle-check"></i>{{ success }}
      </p>

      <button type="submit" class="btn-primary" :disabled="creating">
        <i class="fa-solid fa-user-plus"></i>
        {{ creating ? 'Creando…' : 'Crear usuario' }}
      </button>
    </form>
  </section>
</template>

<style scoped lang="scss">
@use '@/components/users/usersPanel.scss' as *;

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $primary-dark;
  }

  &__input {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    border: 1.5px solid rgba($primary-dark, 0.14);
    border-radius: 12px;
    padding: 0 0.9rem;
    background: $white;

    &:focus-within {
      border-color: $primary;
    }

    i {
      color: $text-secondary;
      font-size: 0.85rem;
      width: 16px;
      text-align: center;
    }

    input {
      flex: 1 1 auto;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      font-family: $font-principal;
      font-size: 0.9rem;
      color: $primary-dark;
      padding: 0.75rem 0;
    }
  }

  &__alert {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    border-radius: 10px;
    padding: 0.7rem 0.9rem;

    &--error {
      color: $alert-error;
      background: $alert-error-bg;
    }

    &--success {
      color: $alert-success;
      background: $alert-success-bg;
    }
  }
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  font-family: $font-principal;
  font-size: 0.92rem;
  font-weight: 800;
  color: $white;
  background: $primary;
  border: none;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: darken($primary, 8);
  }

  &:disabled {
    opacity: 0.55;
  }
}
</style>

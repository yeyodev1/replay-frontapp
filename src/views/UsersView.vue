<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { authService, type PublicUser } from '@/services/auth.service'
import UserCreateForm from '@/components/users/UserCreateForm.vue'
import UserList from '@/components/users/UserList.vue'

const users = ref<PublicUser[]>([])
const loading = ref(false)
const error = ref('')

async function fetchUsers() {
  loading.value = true
  error.value = ''
  try {
    users.value = await authService.listUsers()
  } catch (e: any) {
    error.value = e?.message || 'Error cargando usuarios'
  } finally {
    loading.value = false
  }
}

async function removeUser(u: PublicUser) {
  if (!confirm(`¿Eliminar al usuario ${u.email}?`)) return
  error.value = ''
  try {
    await authService.deleteUser(u.id)
    await fetchUsers()
  } catch (e: any) {
    error.value = e?.message || 'Error eliminando usuario'
  }
}

onMounted(fetchUsers)
</script>

<template>
  <div class="users-page">
    <header class="users-page__head">
      <h1><i class="fa-solid fa-users"></i> Usuarios</h1>
      <p>Da acceso a tu equipo — cada usuario puede generar videos</p>
    </header>

    <p v-if="error" class="users-page__error">
      <i class="fa-solid fa-circle-exclamation"></i>{{ error }}
    </p>

    <main class="users-page__main">
      <UserCreateForm @created="fetchUsers" />
      <UserList :users="users" :loading="loading" @delete="removeUser" />
    </main>
  </div>
</template>

<style scoped lang="scss">
.users-page {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 1.8rem 2rem 3rem;

  &__head {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    h1 {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.4rem;
      font-weight: 800;
      color: $primary-dark;

      i {
        color: $primary;
      }
    }

    p {
      font-size: 0.82rem;
      color: $text-secondary;
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
    gap: 1.5rem;
    flex-wrap: wrap;
  }
}

@media (max-width: 720px) {
  .users-page {
    padding: 1.2rem 1.1rem 2.5rem;
  }
}
</style>

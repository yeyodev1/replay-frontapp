<script setup lang="ts">
import type { PublicUser } from '@/services/auth.service'
import { useUserStore } from '@/stores/user'

defineProps<{ users: PublicUser[]; loading: boolean }>()
const emit = defineEmits<{ (e: 'delete', user: PublicUser): void }>()

const userStore = useUserStore()
</script>

<template>
  <section class="panel panel--list">
    <h2 class="panel__title"><i class="fa-solid fa-users"></i> Usuarios ({{ users.length }})</h2>

    <p v-if="loading" class="users-empty">Cargando…</p>

    <div class="user-list">
      <article v-for="u in users" :key="u.id" class="user-row">
        <span class="user-row__avatar"><i class="fa-solid fa-user"></i></span>
        <span class="user-row__info">
          <strong>{{ u.name }}</strong>
          <small>{{ u.email }}</small>
        </span>
        <span class="user-row__date">
          {{ new Date(u.createdAt).toLocaleDateString('es-EC') }}
        </span>
        <button
          v-if="u.id !== userStore.user?.id"
          class="user-row__delete"
          title="Eliminar"
          @click="emit('delete', u)"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
        <span v-else class="user-row__you">tú</span>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/components/users/usersPanel.scss' as *;

.users-empty {
  color: $text-secondary;
  font-size: 0.9rem;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  border: 1px solid rgba($primary-dark, 0.08);
  border-radius: 12px;
  padding: 0.7rem 1rem;

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: $overlay-purple;
    color: $secondary-dark;
    flex-shrink: 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    min-width: 0;

    strong {
      font-size: 0.88rem;
      color: $primary-dark;
    }

    small {
      font-size: 0.75rem;
      color: $text-secondary;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__date {
    margin-left: auto;
    font-size: 0.72rem;
    color: $text-secondary;
    white-space: nowrap;
  }

  &__delete {
    background: none;
    border: none;
    color: $text-secondary;
    font-size: 0.85rem;
    padding: 0.4rem;

    &:hover {
      color: $alert-error;
    }
  }

  &__you {
    font-size: 0.68rem;
    font-weight: 700;
    color: $primary;
    background: rgba($primary, 0.08);
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
  }
}
</style>

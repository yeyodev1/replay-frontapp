<script setup lang="ts">
defineProps<{
  x: number
  y: number
  icon: string
  color: 'green' | 'blue' | 'purple' | 'pink'
  eyebrow: string
  title: string
  chip?: string
  done?: boolean
  active?: boolean
  hasInput?: boolean
  hasOutput?: boolean
  dark?: boolean
}>()

const emit = defineEmits<{
  (e: 'dragstart', ev: PointerEvent): void
  (e: 'open'): void
}>()
</script>

<template>
  <div
    class="fnode"
    :class="[{ 'is-done': done, 'is-active': active, 'is-dark': dark }]"
    :style="{ transform: `translate(${x}px, ${y}px)` }"
    @pointerdown.stop="emit('dragstart', $event)"
    @click.stop="emit('open')"
  >
    <span v-if="hasInput" class="fnode__port fnode__port--in"></span>
    <span v-if="hasOutput" class="fnode__port fnode__port--out" :class="{ 'is-live': done }"></span>

    <span class="fnode__icon" :class="`fnode__icon--${color}`">
      <i :class="icon"></i>
    </span>

    <span class="fnode__texts">
      <small>{{ eyebrow }}</small>
      <strong>{{ title }}</strong>
      <span v-if="chip" class="fnode__chip">{{ chip }}</span>
    </span>

    <span class="fnode__state">
      <i v-if="done" class="fa-solid fa-circle-check"></i>
      <i v-else class="fa-regular fa-circle"></i>
    </span>

    <slot />
  </div>
</template>

<style scoped lang="scss">
.fnode {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 280px;
  min-height: 96px;
  padding: 0.9rem 1rem;
  background: $white;
  border: 2px solid rgba($primary-dark, 0.12);
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba($primary-dark, 0.12);
  cursor: grab;
  user-select: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    border-color: rgba($primary, 0.55);
    box-shadow: 0 12px 28px rgba($primary-dark, 0.18);
  }

  &.is-done {
    border-color: rgba($BAKANO-GREEN, 0.55);
  }

  &.is-active {
    border-color: $primary;
    box-shadow: 0 0 0 4px rgba($primary, 0.15), 0 12px 28px rgba($primary, 0.2);
  }

  &.is-dark {
    background: $primary-dark;
    border-color: rgba($primary, 0.5);

    .fnode__texts strong {
      color: $text-light;
    }

    .fnode__texts small {
      color: rgba($text-light, 0.5);
    }
  }

  &__port {
    position: absolute;
    top: 50%;
    width: 14px;
    height: 14px;
    margin-top: -7px;
    border-radius: 50%;
    background: $white;
    border: 3px solid rgba($primary-dark, 0.3);

    &--in {
      left: -8px;
    }

    &--out {
      right: -8px;
    }

    &.is-live {
      border-color: $BAKANO-GREEN;
      background: rgba($BAKANO-GREEN, 0.2);
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 13px;
    flex-shrink: 0;
    font-size: 1.05rem;
    color: $white;

    &--green { background: $BAKANO-GREEN; }
    &--blue { background: $alert-info; }
    &--purple { background: $secondary; }
    &--pink { background: $primary; }
  }

  &__texts {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
    flex: 1 1 auto;

    small {
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: $text-secondary;
    }

    strong {
      font-size: 0.86rem;
      font-weight: 800;
      color: $primary-dark;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__chip {
    align-self: flex-start;
    font-size: 0.64rem;
    font-weight: 800;
    color: $primary;
    background: rgba($primary, 0.1);
    border-radius: 999px;
    padding: 0.15rem 0.5rem;
    margin-top: 0.15rem;
    white-space: nowrap;
  }

  &__state {
    flex-shrink: 0;
    font-size: 1rem;

    .fa-circle-check { color: $BAKANO-GREEN; }
    .fa-circle { color: rgba($primary-dark, 0.25); }
  }
}

@media (max-width: 720px) {
  .fnode__port {
    display: none;
  }
}
</style>

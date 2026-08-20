<template>
  <article class="skel">
    <div class="skel__media shimmer"></div>
    <div class="skel__body">
      <div class="skel__line shimmer" style="width: 90%"></div>
      <div class="skel__line shimmer" style="width: 60%"></div>
      <div class="skel__chips">
        <span class="skel__chip shimmer"></span>
        <span class="skel__chip shimmer" style="width: 46px"></span>
        <span class="skel__chip shimmer" style="width: 38px"></span>
      </div>
      <div class="skel__footer">
        <span class="skel__chip shimmer" style="width: 64px"></span>
        <span class="skel__chip shimmer" style="width: 90px; margin-left: auto"></span>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.skel {
  display: flex;
  flex-direction: column;
  background: $white;
  border: 1px solid rgba($primary-dark, 0.08);
  border-radius: 16px;
  overflow: hidden;

  &__media {
    width: 100%;
    height: 180px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    padding: 1rem;
  }

  &__line {
    height: 13px;
    border-radius: 6px;
  }

  &__chips,
  &__footer {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  &__chip {
    width: 70px;
    height: 20px;
    border-radius: 999px;
  }
}

.shimmer {
  background: linear-gradient(
    100deg,
    rgba($primary-dark, 0.06) 30%,
    rgba($primary-dark, 0.12) 50%,
    rgba($primary-dark, 0.06) 70%
  );
  background-size: 200% 100%;
  animation: shimmer 1.3s ease-in-out infinite;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shimmer {
    animation: none;
  }
}
</style>

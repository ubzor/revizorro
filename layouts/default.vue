<template>
  <div
    class="min-h-screen flex flex-col gap-8"
    :style="{ backgroundColor: 'var(--surface-50)' }"
  >
    <HeaderNavbar />
    <div class="container mx-auto">
      <slot />
    </div>
  </div>
</template>

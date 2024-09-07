<template>
  <div
    class="min-h-screen flex flex-col"
    :style="{ backgroundColor: 'var(--surface-50)' }"
  >
    <HeaderNavbar />
    <slot />
  </div>
</template>

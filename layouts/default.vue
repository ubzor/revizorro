<template>
  <div
    class="min-h-screen flex flex-col gap-8"
    :style="{ backgroundColor: 'var(--surface-50)' }"
  >
    <HeaderNavbar />
    <div class="p-4">
      <slot />
    </div>
  </div>

  <ModalEnterQuantity />
</template>

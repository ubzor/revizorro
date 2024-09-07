<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Toast />
</template>

<style>
/* TODO: перенести куда-то */

.p-icon-field > .p-input-icon {
  top: 50%;
  transform: translateY(-50%);
  margin-top: 0;
  z-index: 1;
}

/* .p-icon-field > .p-password > .p-inputtext,
.p-icon-field > .p-float-label > .p-inputtext {
  padding-left: 2.5rem;
  width: 100%;
} */

/* .p-icon-field > .p-float-label > label {
  left: 2.5rem;
} */

.p-password > .p-inputtext {
  @apply w-full;
}
</style>

<template>
  <div class="grow flex flex-col gap-12 items-center justify-center">
    <FormRegister
      v-if="!isRegistrationComplete"
      v-motion-slide-left
      @success="onRegistrationSuccess"
    />
    <FormConfirmRegistration
      v-else
      v-motion-slide-left
      :email="email"
      @success="onConfirmRegistrationSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["is-not-authenticated"],
});

const isRegistrationComplete = ref(false);
const email = ref<string>();

const onRegistrationSuccess = (registeredEmail: string) => {
  email.value = registeredEmail;
  isRegistrationComplete.value = true;
};

const onConfirmRegistrationSuccess = () => {
  navigateTo("/");
};
</script>

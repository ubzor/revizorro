<template>
  <div class="grow flex flex-col gap-12 items-center justify-center p-2">
    <FormLogin
      v-if="!isLoginComplete"
      v-motion-slide-left
      @success="onLoginSuccess"
      @confirm-registration="onConfirmRegistration"
    />
    <FormConfirmRegistration
      v-else
      v-motion-slide-left
      :email="email"
      @success="onLoginSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["is-not-authenticated"],
});

const isLoginComplete = ref(false);
const email = ref<string>();

const onLoginSuccess = async () => {
  navigateTo("/");
};

const onConfirmRegistration = async (loginEmail: string) => {
  email.value = loginEmail;
  isLoginComplete.value = true;
};
</script>

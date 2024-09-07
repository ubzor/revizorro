<template>
  <div class="grow flex flex-col gap-12 items-center justify-center">
    <FormResetPassword
      v-if="!isEmailEntered"
      v-motion-slide-left
      @success="onEmailEntered"
    />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["is-not-authenticated"],
});

const isEmailEntered = ref(false);
const email = ref<string>();

const onEmailEntered = async (resettingEmail: string) => {
  email.value = resettingEmail;
  isEmailEntered.value = true;
};

// const isLoginComplete = ref(false);
// const email = ref<string>();

// const onLoginSuccess = async () => {
//   navigateTo("/");
// };

// const onConfirmRegistration = async (loginEmail: string) => {
//   email.value = loginEmail;
//   isLoginComplete.value = true;
// };
</script>

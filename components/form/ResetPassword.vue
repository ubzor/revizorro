<template>
  <form class="max-w-96 w-full" @submit.prevent="resetPassword">
    <Card>
      <template #title>Reset password</template>
      <template #subtitle>Enter email to reset password</template>

      <template #content>
        <div class="flex flex-col gap-8 my-8">
          <div class="flex flex-col gap-2">
            <IconField icon-position="right">
              <FloatLabel>
                <InputText
                  v-model="email"
                  id="login__email"
                  class="w-full"
                  :invalid="!!errors.email"
                  :disabled="isSubmitting"
                />
                <label for="login__email">Email</label>
              </FloatLabel>
              <InputIcon v-if="errors.email">
                <Icon
                  name="i-heroicons-exclamation-triangle-20-solid"
                  class="text-red-500"
                  size="16"
                />
              </InputIcon>
            </IconField>
            <small v-if="errors.email" v-motion-slide-top class="text-red-500">
              {{ errors.email }}
            </small>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="w-full flex flex-col gap-2">
          <div class="w-full">
            <Button
              label="Submit"
              type="submit"
              class="w-full"
              :loading="isSubmitting"
            />
          </div>
        </div>
      </template>
    </Card>
  </form>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

const emit = defineEmits<{
  (event: "success", email: string): void;
}>();

const toast = useToast();

const { handleSubmit, errors, isSubmitting, defineField, setFieldError } =
  useForm({
    initialValues: {
      email: "",
    },
    validationSchema: toTypedSchema(resetPasswordFormValidationSchema),
    validateOnMount: false,
  });

const [email] = defineField("email");

const resetPassword = handleSubmit(async (form) => {
  try {
    await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: form,
    });

    emit("success", form.email);
  } catch (error: any) {
    const fieldErrors = error.data?.data?.fieldErrors as {
      path: string;
      message: string;
    }[];

    if (fieldErrors) {
      fieldErrors.forEach(({ path, message }) => {
        setFieldError(path as "email", message);
      });
    }
  }
});
</script>

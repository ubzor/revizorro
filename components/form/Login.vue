<template>
  <form class="max-w-96 w-full" @submit.prevent="login">
    <Card>
      <template #title>Sign In</template>
      <template #subtitle>Login to your account</template>

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

          <div class="flex flex-col gap-2">
            <IconField icon-position="right">
              <FloatLabel>
                <Password
                  v-model="password"
                  class="w-full"
                  id="login__password"
                  :invalid="!!errors.password"
                  :disabled="isSubmitting"
                />
                <label for="login__password">Password</label>
              </FloatLabel>
              <InputIcon v-if="errors.password">
                <Icon
                  name="i-heroicons-exclamation-triangle-20-solid"
                  class="text-red-500"
                  size="16"
                />
              </InputIcon>
            </IconField>
            <small
              v-if="errors.password"
              v-motion-slide-top
              class="text-red-500"
            >
              {{ errors.password }}
            </small>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="w-full flex flex-wrap gap-2">
          <div :style="{ flexGrow: 11.2 }">
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
  (event: "success"): void;
  (event: "confirmRegistration", email: string): void;
}>();

const { handleSubmit, errors, isSubmitting, defineField, setFieldError } =
  useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toTypedSchema(loginFormValidationSchema),
    validateOnMount: false,
  });

const [email] = defineField("email");
const [password] = defineField("password");

const login = handleSubmit(async (form) => {
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: form,
    });

    emit("success");
  } catch (error: any) {
    const fieldErrors = error.data?.data?.fieldErrors as {
      path: string;
      message: string;
    }[];

    if (fieldErrors) {
      if (fieldErrors.find(({ path }) => path === "registrationConfirmed")) {
        emit("confirmRegistration", form.email);
        return;
      }

      fieldErrors.forEach(({ path, message }) => {
        setFieldError(path as "email" | "password", message);
      });
    }
  }
});
</script>

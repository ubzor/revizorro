<template>
  <form class="max-w-96 w-full" @submit.prevent="register">
    <Card>
      <template #title>Sign Up</template>
      <template #subtitle>Create an account</template>

      <template #content>
        <div class="flex flex-col gap-8 my-8">
          <div class="flex flex-col gap-2">
            <IconField icon-position="right">
              <FloatLabel>
                <InputText
                  v-model="email"
                  id="register__email"
                  class="w-full"
                  :invalid="!emailIsAvailable || !!errors.email"
                  :disabled="isSubmitting"
                />
                <label for="register__email">Email</label>
              </FloatLabel>
              <InputIcon v-if="emailIsAvailable !== null || errors.email">
                <Icon
                  v-if="emailIsAvailable"
                  name="i-heroicons-shield-check-20-solid"
                  :style="{ color: 'var(--primary-color)' }"
                  size="16"
                />
                <Icon
                  v-else-if="!emailIsAvailable || errors.email"
                  name="i-heroicons-exclamation-triangle-20-solid"
                  class="text-red-500"
                  size="16"
                />
              </InputIcon>
            </IconField>
            <small
              v-if="emailIsAvailable"
              v-motion-slide-top
              :style="{ color: 'var(--primary-color)' }"
            >
              Email is available
            </small>
            <small
              v-else-if="emailIsAvailable === false || errors.email"
              v-motion-slide-top
              class="text-red-500"
            >
              {{
                emailIsAvailable === false
                  ? "This email is already used"
                  : errors.email
              }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <IconField icon-position="right">
              <FloatLabel>
                <Password
                  v-model="password"
                  class="w-full"
                  id="register__password"
                  :invalid="!!errors.password"
                  :disabled="isSubmitting"
                />
                <label for="register__password">Password</label>
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

          <div class="flex flex-col gap-2">
            <IconField icon-position="right">
              <FloatLabel>
                <Password
                  v-model="repeatPassword"
                  class="w-full"
                  id="register__repeat-password"
                  :invalid="!!errors.repeatPassword"
                  :disabled="isSubmitting"
                />
                <label for="register__repeat-password">Repeat password</label>
              </FloatLabel>
              <InputIcon v-if="errors.repeatPassword">
                <Icon
                  name="i-heroicons-exclamation-triangle-20-solid"
                  class="text-red-500"
                  size="16"
                />
              </InputIcon>
            </IconField>
            <small
              v-if="errors.repeatPassword"
              v-motion-slide-top
              class="text-red-500"
            >
              {{ errors.repeatPassword }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
              <Checkbox
                v-model="isAgreed"
                binary
                input-id="register__isAgreed"
                :invalid="!!errors.isAgreed"
                :disabled="isSubmitting"
              />
              <label for="register__isAgreed">
                I agree to
                <NuxtLink
                  to="/terms"
                  class="underline font-medium whitespace-nowrap"
                  :style="{ color: 'var(--primary-color)' }"
                  >terms and conditions</NuxtLink
                >
              </label>
            </div>
            <small
              v-if="errors.isAgreed"
              v-motion-slide-top
              class="text-red-500"
            >
              {{ errors.isAgreed }}
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
          <div class="col-span-2 text-center mt-4 grow">
            Already have an account?
            <NuxtLink
              to="/auth/login"
              class="underline font-medium whitespace-nowrap"
              :style="{ color: 'var(--primary-color)' }"
              >Sign In</NuxtLink
            >
            now
          </div>
        </div>
      </template>
    </Card>
  </form>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

const emit = defineEmits<{ (event: "success", email: string): void }>();

const toast = useToast();

const { handleSubmit, errors, isSubmitting, defineField, setFieldError } =
  useForm({
    initialValues: {
      email: "",
      password: "",
      repeatPassword: "",
      isAgreed: true,
    },
    validationSchema: toTypedSchema(registerFormValidationSchema),
    validateOnMount: false,
  });

const [email] = defineField("email");
const [password] = defineField("password");
const [repeatPassword] = defineField("repeatPassword");
const [isAgreed] = defineField("isAgreed");

const register = handleSubmit(async (form) => {
  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: form,
    });

    toast.add({
      summary: "Registration completed",
      detail: `Thank you for registering`,
      severity: "success",
      life: 3000,
    });

    emit("success", form.email);
  } catch (error: any) {
    const fieldErrors = error.data?.data?.fieldErrors as {
      path: string;
      message: string;
    }[];

    if (fieldErrors) {
      fieldErrors.forEach(({ path, message }) => {
        setFieldError(path as "email" | "password" | "isAgreed", message);
      });
    }
  }
});

const { data } = useEmailIsAvailableQuery({
  // @ts-ignore
  variables: { email: email ?? "" },
});

const emailIsAvailable = computed(() =>
  data.value && "data" in data.value.emailIsAvailable
    ? data.value.emailIsAvailable.data
    : null
);
</script>

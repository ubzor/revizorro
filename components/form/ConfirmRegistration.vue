<template>
  <form class="max-w-96 w-full" @submit.prevent="confirmRegistration">
    <Card>
      <template #title>Confirm registration</template>
      <template #subtitle>Enter the code that was sent to your email</template>

      <template #content>
        <div class="flex flex-col gap-8 my-8">
          <div class="flex flex-col gap-2">
            <FloatLabel>
              <InputText
                v-model="values.email"
                id="confirm-registration__email"
                class="w-full"
                disabled
              />
              <label for="registration__email">Email</label>
            </FloatLabel>
          </div>

          <div class="flex flex-col gap-2">
            <!-- <label for="confirm-registration__code">Code</label>
            <InputOtp
              v-model="code"
              :length="6"
              id="confirm-registration__code"
              class="w-full"
              :invalid="!!errors.code"
              :disabled="isSubmitting"
            /> -->
            <IconField icon-position="right">
              <FloatLabel>
                <InputText
                  v-model="code"
                  class="w-full"
                  id="confirm-registration__code"
                  :invalid="!!errors.code"
                  :disabled="isSubmitting"
                />
                <label for="confirm-registration__code">Code</label>
              </FloatLabel>
              <InputIcon v-if="errors.code">
                <Icon
                  name="i-heroicons-exclamation-triangle-20-solid"
                  class="text-red-500"
                  size="16"
                />
              </InputIcon>
            </IconField>
            <small v-if="errors.code" class="text-red-500">
              {{ errors.code }}
            </small>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="w-full flex gap-2">
          <div class="w-1/2">
            <Button
              label="Submit"
              type="submit"
              class="w-full"
              :loading="isSubmitting"
            />
          </div>
          <div class="w-1/2">
            <Button
              :label="resendCodeButtonLabel"
              class="w-full"
              text
              :disabled="!!secondsUntilResendCodeIsActive"
              @click="sendCode"
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

const { email } = defineProps<{ email?: string }>();

const emit = defineEmits<{ (event: "success"): void }>();

const toast = useToast();
const now = useNow();

const {
  handleSubmit,
  values,
  errors,
  isSubmitting,
  defineField,
  setFieldError,
} = useForm({
  initialValues: {
    email,
    code: "",
  },
  validationSchema: toTypedSchema(confirmRegistrationFormValidationSchema),
  validateOnMount: false,
});

const [code] = defineField("code");

const resendCodeButtonLabel = computed(() => {
  let label = "Resend";

  if (secondsUntilResendCodeIsActive.value) {
    label += ` in 0:${
      secondsUntilResendCodeIsActive.value.toString().length > 1
        ? secondsUntilResendCodeIsActive.value
        : `0${secondsUntilResendCodeIsActive.value}`
    }`;
  } else {
    label += " code";
  }

  return label;
});

const confirmRegistration = handleSubmit(async (form) => {
  try {
    await $fetch("/api/auth/confirm-registration", {
      method: "POST",
      body: form,
    });

    toast.add({
      summary: "Registration confirmed",
      detail: `Registration confirmed for ${email}`,
      severity: "success",
      life: 3000,
    });

    emit("success");
  } catch (error: any) {
    const fieldErrors = error.data?.data?.fieldErrors as {
      path: string;
      message: string;
    }[];

    if (fieldErrors) {
      fieldErrors.forEach(({ path, message }) => {
        setFieldError(path as "email" | "code", message);
      });
    }
  }
});

const sendCode = async () => {
  try {
    await $fetch("/api/auth/send-registration-confirmation-code", {
      method: "POST",
      body: { email },
    });

    toast.add({
      summary: "Code sent",
      detail: `Code was sent to ${email}`,
      severity: "info",
      life: 3000,
    });
  } catch (error: any) {
    const fieldErrors = error.data?.data?.fieldErrors as {
      path: string;
      message: string;
    }[];

    if (fieldErrors) {
      fieldErrors.forEach(({ path, message }) => {
        setFieldError(path as "email" | "code", message);
      });
    }
  }

  executeQuery({
    variables: { email: email ?? "" },
    requestPolicy: "network-only",
  });
};

watch(code, (value) => {
  if (value?.length === 6) {
    confirmRegistration();
  }
});

const { data, executeQuery } = useLastRegistrationConfirmationCodeSentAtQuery({
  variables: { email: email ?? "" },
});

const lastRegistrationConfirmationCodeSentAt = computed(() => {
  if (data.value?.lastRegistrationConfirmationCodeSentAt === null) {
    return null;
  }

  if (
    data.value?.lastRegistrationConfirmationCodeSentAt &&
    "data" in data.value.lastRegistrationConfirmationCodeSentAt
  ) {
    return new Date(data.value.lastRegistrationConfirmationCodeSentAt.data);
  }

  return undefined;

  // TODO: добавить обработку ошибок
});

const secondsUntilResendCodeIsActive = computed(() => {
  if (lastRegistrationConfirmationCodeSentAt.value) {
    if (
      lastRegistrationConfirmationCodeSentAt.value.getTime() <
      now.value.getTime() - 1000 * 60 * 1
    ) {
      return 0;
    }

    if (
      now.value.getTime() -
        lastRegistrationConfirmationCodeSentAt.value.getTime() <
      1000 * 60 * 1
    ) {
      return (
        60 -
        Math.floor(
          (now.value.getTime() -
            lastRegistrationConfirmationCodeSentAt.value.getTime()) /
            1000
        )
      );
    }
  }

  return null;
});

watch(lastRegistrationConfirmationCodeSentAt, (sentAt) => {
  if (
    sentAt === null ||
    (sentAt && sentAt.getTime() + 1000 * 60 * 15 < now.value.getTime())
  ) {
    sendCode();
  }
});
</script>

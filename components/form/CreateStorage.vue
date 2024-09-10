<template>
  <form class="w-full h-full" @submit.prevent="createStorage">
    <Card class="w-full h-full">
      <template #title>Add new storage</template>

      <template #content>
        <div class="flex flex-col gap-2">
          <IconField icon-position="right">
            <FloatLabel>
              <InputText
                v-model="label"
                id="create-storage__email"
                class="w-full"
                :invalid="!!errors.label"
                :disabled="isSubmitting"
              />
              <label for="create-storage__email">Label</label>
            </FloatLabel>
            <InputIcon v-if="errors.label">
              <Icon
                name="i-heroicons-exclamation-triangle-20-solid"
                class="text-red-500"
                size="16"
              />
            </InputIcon>
          </IconField>
          <small v-if="errors.label" v-motion-slide-top class="text-red-500">
            {{ errors.label }}
          </small>
        </div>
      </template>

      <template #footer>
        <div class="w-full flex flex-wrap gap-2">
          <div class="grow">
            <Button
              label="Submit"
              type="submit"
              class="w-full"
              :loading="isSubmitting"
            />
          </div>
          <div>
            <Button
              label="Cancel"
              class="w-full"
              severity="secondary"
              :disabled="isSubmitting"
              @click="cancel"
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

import type { Storage } from "@/generated/schema";

const emit = defineEmits<{
  (event: "success", payload: Storage): void;
  (event: "cancel"): void;
}>();

const { executeMutation } = useCreateStorageMutation();
const toast = useToast();

const { handleSubmit, errors, isSubmitting, defineField, setFieldError } =
  useForm({
    initialValues: {
      label: "",
    },
    validationSchema: toTypedSchema(createStorageValidationSchema),
    validateOnMount: false,
  });

const [label] = defineField("label");

const createStorage = handleSubmit(async (form) => {
  const result = await executeMutation(form);

  if (result.data?.createStorage && "data" in result.data?.createStorage) {
    toast.add({
      summary: "Storage created",
      detail: `Storage "${form.label}" created`,
      severity: "success",
      life: 3000,
    });

    emit("success", result.data.createStorage.data);
  }
});

const cancel = () => {
  emit("cancel");
};
</script>

<style lang="sass" scoped>
:deep()
    .p-card-body
        @apply h-full

    .p-card-content
        @apply grow
</style>

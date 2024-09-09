<template>
  <form @submit.prevent="createSku" class="w-full flex flex-row gap-2">
    <div class="flex flex-col gap-2 grow">
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

    <div>
      <Button
        label="Add"
        type="submit"
        class="w-full"
        :loading="isSubmitting"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

import type { Sku } from "~/generated/schema";

const emit = defineEmits<{
  (event: "success", payload: Sku): void;
}>();

const { executeMutation } = useCreateSkuMutation();
const toast = useToast();

const {
  handleSubmit,
  errors,
  isSubmitting,
  defineField,
  setFieldError,
  resetForm,
} = useForm({
  initialValues: {
    label: "",
  },
  validationSchema: toTypedSchema(createSkuValidationSchema),
  validateOnMount: false,
});

const [label] = defineField("label");

const createSku = handleSubmit(async (form) => {
  const result = await executeMutation(form);

  if (result.data?.createSku && "data" in result.data?.createSku) {
    resetForm();

    toast.add({
      summary: "Sku created",
      detail: `Sku "${form.label}" created`,
      severity: "success",
      life: 3000,
    });

    emit("success", result.data.createSku.data);
  }
});
</script>

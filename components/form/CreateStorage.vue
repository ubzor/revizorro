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
              @click=""
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
  (event: "cancel"): void;
}>();

const { handleSubmit, errors, isSubmitting, defineField, setFieldError } =
  useForm({
    initialValues: {
      label: "",
    },
    validationSchema: toTypedSchema(createStorageValidationSchema),
    validateOnMount: false,
  });

const [label] = defineField("label");

const createStorage = handleSubmit(async (form) => {});
</script>

<style lang="sass" scoped>
:deep()
    .p-card-body
        @apply h-full

    .p-card-content
        @apply grow
</style>

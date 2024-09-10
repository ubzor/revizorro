<template>
  <form class="w-full flex flex-col gap-8" @submit.prevent="onSubmit">
    <div class="flex flex-col gap-2">
      <IconField icon-position="right">
        <FloatLabel>
          <InputNumber
            v-model="quantity"
            id="enter-quantity__quantity"
            class="w-full"
            :invalid="!!errors.quantity"
            :disabled="isSubmitting"
          />
          <label for="create-storage__email">Quantity</label>
        </FloatLabel>
        <InputIcon v-if="errors.quantity">
          <Icon
            name="i-heroicons-exclamation-triangle-20-solid"
            class="text-red-500"
            size="16"
          />
        </InputIcon>
      </IconField>
      <small v-if="errors.quantity" v-motion-slide-top class="text-red-500">
        {{ errors.quantity }}
      </small>
    </div>

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
  </form>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

const emit = defineEmits<{
  (event: "success", payload: any): void;
  (event: "cancel"): void;
}>();

const toast = useToast();

const { handleSubmit, errors, isSubmitting, defineField, setFieldError } =
  useForm({
    initialValues: {
      quantity: 0,
    },
    validationSchema: toTypedSchema(enterQuantityFormValidationSchema),
    validateOnMount: false,
  });

const [quantity] = defineField("quantity");

const onSubmit = handleSubmit(async (form) => {});

const cancel = () => {
  emit("cancel");
};
</script>

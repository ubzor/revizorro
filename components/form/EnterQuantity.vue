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
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

import { UIStates } from "@/types/UIStates";

import type { Stock } from "@/generated/schema";

const emit = defineEmits<{
  (event: "success", payload: any): void;
  (event: "cancel"): void;
}>();

const { uiState, sku, storage } = storeToRefs(useUIStore());

const { executeMutation } = useAddStockMutation();
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

const onSubmit = handleSubmit(async (form) => {
  switch (uiState.value) {
    case UIStates.DraggingSkuFromSkuList:
      if (sku.value && storage.value) {
        const result = await executeMutation({
          ...form,
          skuId: sku.value?.id,
          storageId: storage.value?.id,
        });

        if (result.data?.addStock && "data" in result.data?.addStock) {
          toast.add({
            summary: "Stock added",
            detail: `Stock of ${form.quantity} x "${sku.value.label}" added to ${storage.value.label}`,
            severity: "success",
            life: 3000,
          });

          emit("success", result.data.addStock.data);
        }
      }

      break;
  }
});

const cancel = () => {
  emit("cancel");
};
</script>

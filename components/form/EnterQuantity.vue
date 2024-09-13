<template>
  <form class="w-full flex flex-col gap-2" @submit.prevent="onSubmit">
    <div class="flex flex-col gap-2">
      <IconField icon-position="right">
        <FloatLabel>
          <InputNumber
            v-model="quantity"
            id="enter-quantity__quantity"
            class="w-full"
            :invalid="!!errors.quantity"
            :disabled="isSubmitting"
            show-buttons
            button-layout="horizontal"
            :min="0"
            :max="maxQuantity"
            :step="1"
          >
            <template #incrementicon> + </template>
            <template #decrementicon> - </template>
          </InputNumber>
          <label for="create-storage__email">Quantity</label>
        </FloatLabel>
        <InputIcon v-if="errors.quantity">
          <Icon
            name="i-heroicons-exclamation-triangle-20-solid"
            class="text-red-500 mr-10"
            size="16"
          />
        </InputIcon>
      </IconField>
      <small v-if="errors.quantity" v-motion-slide-top class="text-red-500">
        {{ errors.quantity }}
      </small>
    </div>

    <div class="w-full flex flex-row justify-between content-between gap-2">
      <div>
        <StockChip
          v-if="uiState === UIStates.DraggingStockFromStorage"
          :label="stock?.storage?.label"
          :quantity="(stock?.quantity! - quantity!).toString()"
        />
        <StockChip
          v-else-if="uiState === UIStates.DraggingSkuFromSkuList"
          label="Outside"
          quantity="..."
        />
      </div>
      <div>
        <Icon name="heroicons:arrow-long-right-solid" size="16" />
      </div>
      <div>
        <StockChip
          :label="storage?.label"
          :quantity="(destinationStockQuantity + quantity!).toString()"
        />
      </div>
    </div>

    <div class="w-full flex flex-wrap gap-2 mt-4">
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

const { uiState, sku, storage, stock } = storeToRefs(useUIStore());

const { executeMutation: executeAddStockMutation } = useAddStockMutation();
const { executeMutation: executeMoveStockMutation } = useMoveStockMutation();
const toast = useToast();

const maxQuantity = computed(() => {
  switch (uiState.value) {
    case UIStates.DraggingSkuFromSkuList:
      return undefined;

    case UIStates.DraggingStockFromStorage:
      return stock.value?.quantity;
  }
});

const destinationStockQuantity = computed(() => {
  switch (uiState.value) {
    case UIStates.DraggingSkuFromSkuList:
      return (
        storage.value?.stocks?.find(
          ({ sku: storageSku }) => storageSku?.id == sku.value?.id
        )?.quantity ?? 0
      );

    case UIStates.DraggingStockFromStorage:
      return (
        storage.value?.stocks?.find(
          ({ sku: storageSku }) => storageSku?.id === stock.value?.sku?.id
        )?.quantity ?? 0
      );
  }

  return 0;
});

const { handleSubmit, errors, isSubmitting, defineField, setFieldError } =
  useForm({
    initialValues: {
      quantity: 0,
    },
    validationSchema: toTypedSchema(enterQuantityFormValidationSchema),
    validateOnMount: false,
  });

const [quantity] = defineField("quantity");

const onSubmit = handleSubmit(async ({ quantity }) => {
  switch (uiState.value) {
    case UIStates.DraggingSkuFromSkuList:
      if (sku.value && storage.value) {
        const result = await executeAddStockMutation({
          quantity,
          skuId: sku.value?.id,
          storageId: storage.value?.id,
        });

        if (result.data?.addStock && "data" in result.data?.addStock) {
          toast.add({
            summary: "Stock added",
            detail: `Stock of ${quantity} x "${sku.value.label}" added to ${storage.value.label}`,
            severity: "success",
            life: 3000,
          });

          emit("success", result.data.addStock.data);
        }
      }

      break;

    case UIStates.DraggingStockFromStorage:
      if (stock.value && storage.value) {
        const result = await executeMoveStockMutation({
          quantity,
          id: stock.value.id,
          toStorageId: storage.value.id,
        });

        if (result.data?.moveStock && "data" in result.data?.moveStock) {
          toast.add({
            summary: "Stock moved",
            detail: `Stock of ${quantity} x "${stock.value.sku?.label}" moved from ${stock.value.storage?.label} to ${storage.value.label}`,
            severity: "success",
            life: 3000,
          });

          emit("success", result.data?.moveStock.data);
        }
      }

      break;
  }
});

const cancel = () => {
  emit("cancel");
};
</script>

<style lang="sass" scoped>
:deep()
  .p-float-label
    & > .p-invalid
      & + label
        @apply ml-10
</style>

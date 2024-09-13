<template>
  <div class="w-[calc((100%-16px)/3)] min-h-64">
    <Card class="w-full h-full">
      <template #title>{{ storage.label }}</template>
      <template #content>
        <VueDraggable
          :list="storage.stocks"
          :group="{ name: 'storage' }"
          item-key="id"
          class="flex flex-row flex-wrap gap-2 h-full w-full justify-start items-start content-baseline"
          @start="onDragStart"
          @change="onDragChange"
        >
          <template #item="{ element, index }">
            <StockListItem
              :stock="element"
              :key="element.id"
              :data-draggable-id="element.id"
            />
          </template>
        </VueDraggable>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import VueDraggable from "vuedraggable";

import { UIStates } from "@/types/UIStates";

import type { Sku, Storage } from "@/generated/schema";

const { storage } = defineProps<{
  storage: Storage;
}>();

const {
  uiState,
  sku,
  storage: uiStateStorage,
  stock,
  isModalEnterQuantityVisible,
} = storeToRefs(useUIStore());

const onDragStart = ({ item }: { item: HTMLElement }) => {
  uiState.value = UIStates.DraggingStockFromStorage;

  // @ts-ignore
  stock.value = item.__draggable_context.element;
};

const onDragChange = async ({
  added,
}: {
  added?: { element: Sku; newIndex: number };
}) => {
  if (!added) return;

  storage.stocks = storage.stocks.filter(({ id }) => id !== added.element.id);

  switch (uiState.value) {
    case UIStates.DraggingSkuFromSkuList:
      uiStateStorage.value = storage;
      sku.value = added.element;
      isModalEnterQuantityVisible.value = true;
      break;

    case UIStates.DraggingStockFromStorage:
      if (storage.id !== stock.value?.storageId) {
        uiStateStorage.value = storage;
        isModalEnterQuantityVisible.value = true;
      }
      break;
  }
};
</script>

<style lang="sass" scoped>
:deep()
    .p-card-body
        @apply h-full

    .p-card-content
        @apply grow
</style>

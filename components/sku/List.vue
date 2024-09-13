<template>
  <Card class="w-full h-full">
    <template #header>
      <div class="p-4 pb-0">
        <FormFilterSkus />
      </div>
    </template>

    <template #content>
      <VueDraggable
        :list="skus"
        :group="{ name: 'storage' }"
        item-key="id"
        class="flex flex-row flex-wrap gap-2 h-full items-start justify-start content-baseline"
        @start="onDragStart"
        @change="onDragChange"
      >
        <template #item="{ element, index }">
          <SkuListItem
            :sku="element"
            :key="element.id"
            :quantity="element.quantity ?? 0"
          />
        </template>
      </VueDraggable>
    </template>

    <template #footer>
      <FormCreateSku @success="onCreateSkuSuccess" />
    </template>
  </Card>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import VueDraggable from "vuedraggable";

import { UIStates } from "@/types/UIStates";

import type { Sku, Storage, Stock } from "@/generated/schema";

const { skus } = defineProps<{
  skus: (Sku & { quantity: number })[];
}>();

const uiStore = useUIStore();

const { uiState, sku, stock, isModalEnterQuantityVisible } =
  storeToRefs(uiStore);

const onDragStart = ({ item }: { item: HTMLElement }) => {
  uiState.value = UIStates.DraggingSkuFromSkuList;

  // @ts-ignore
  sku.value = item.__draggable_context.element;
};

const onDragChange = ({
  added,
}: {
  added?: { element: Sku | Stock; newIndex: number };
}) => {
  if (!added) return;

  switch (uiState.value) {
    case UIStates.DraggingStockFromStorage:
      stock.value = added.element as Stock;
      isModalEnterQuantityVisible.value = true;
      break;
  }
};

const onCreateSkuSuccess = (_sku: Sku) => {
  uiStore.refetch();
};
</script>

<style lang="sass" scoped>
:deep()
    .p-card-body
        @apply h-full

    .p-card-content
        @apply grow
</style>

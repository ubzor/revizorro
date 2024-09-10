<template>
  <div class="w-64 h-64">
    <Card class="w-full h-full">
      <template #title>{{ storage.label }}</template>
      <template #content>
        <VueDraggable
          :list="[]"
          :group="{ name: 'storage' }"
          item-key="id"
          class="flex flex-row flex-wrap gap-2 h-full w-full"
          @change="onDragChange"
        >
          <template #item="{ element, index }"></template>
        </VueDraggable>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import VueDraggable from "vuedraggable";

import { UIStates } from "@/types/UIStates";

import type { Sku, Storage } from "~/generated/schema";

const { storage } = defineProps<{
  storage: Storage;
}>();

const { uiState, isModalEnterQuantityVisible } = storeToRefs(useUIStore());

const onDragChange = async ({
  added,
}: {
  added?: { element: Sku; newIndex: number };
}) => {
  switch (uiState.value) {
    case UIStates.DraggingSkuFromSkuList:
      if (added) {
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

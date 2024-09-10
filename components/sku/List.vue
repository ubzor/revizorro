<template>
  <Card class="w-full h-full">
    <template #content>
      <VueDraggable
        :list="skus"
        :group="{ name: 'storage', pull: 'clone' }"
        item-key="id"
        class="flex flex-row flex-wrap gap-2"
        @start="onDragStart"
      >
        <template #item="{ element, index }">
          <SkuListItem :sku="element" :key="element.id" />
        </template>
      </VueDraggable>
    </template>

    <template #footer>
      <FormCreateSku />
    </template>
  </Card>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import VueDraggable from "vuedraggable";

import { UIStates } from "@/types/UIStates";

import type { Sku } from "~/generated/schema";

// const emit = defineEmits<{
//   (event: "dragStart", payload: Sku): void;
// }>();

const { data } = useListSkusQuery({ variables: {} });

const { uiState } = storeToRefs(useUIStore());

const skus = computed(() => data?.value?.listSkus ?? []);

const onDragStart = ({ oldIndex }: { oldIndex: number }) => {
  // skus.value[oldIndex]
  uiState.value = UIStates.DraggingSkuFromSkuList;
};
</script>

<style lang="sass" scoped>
:deep()
    .p-card-body
        @apply h-full

    .p-card-content
        @apply grow
</style>

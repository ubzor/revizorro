<template>
  <Dialog
    v-model:visible="isModalEnterQuantityVisible"
    modal
    header="Enter quantity"
    :style="{ width: '100%', maxWidth: '25rem' }"
    @after-hide="uiStore.reset()"
  >
    <FormEnterQuantity @success="uiStore.reset()" @cancel="uiStore.reset()" />
  </Dialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

const uiStore = useUIStore();

const { isModalEnterQuantityVisible } = storeToRefs(uiStore);
</script>

<template>
  <Card class="w-full h-full">
    <template #content>
      <div>
        <SkuListItem v-for="sku in skus" :sku="sku" :key="sku.id" />
      </div>
    </template>

    <template #footer>
      <FormCreateSku />
    </template>
  </Card>
</template>

<script lang="ts" setup>
import type { Sku } from "~/generated/schema";

const { data } = useListSkusQuery({ variables: {} });

const skus = computed(() => data?.value?.listSkus ?? []);
</script>

<style lang="sass" scoped>
:deep()
    .p-card-body
        @apply h-full

    .p-card-content
        @apply grow
</style>

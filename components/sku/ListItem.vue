<template>
  <StockChip
    :label="sku.label"
    :quantity="quantity > 0 ? quantity.toString() : undefined"
  />
</template>

<script lang="ts" setup>
import type { Sku } from "@/generated/schema";

const { sku, quantity } = defineProps<{ sku: Sku; quantity: number }>();
</script>

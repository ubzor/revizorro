<template>
  <StockChip :label="sku.label" :quantity="quantity" />
</template>

<script lang="ts" setup>
import type { Sku } from "@/generated/schema";

const { sku, quantity } = defineProps<{ sku: Sku; quantity: number }>();
</script>

<template>
  <StockChip :label="stock.sku?.label" :quantity="stock.quantity" />
</template>

<script lang="ts" setup>
import type { Stock } from "@/generated/schema";

const { stock } = defineProps<{ stock: Stock }>();
</script>

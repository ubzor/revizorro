<template>
  <StockChip :label="sku.label" :quantity="0" />
</template>

<script lang="ts" setup>
import type { Sku } from "@/generated/schema";

const { sku } = defineProps<{ sku: Sku }>();
</script>

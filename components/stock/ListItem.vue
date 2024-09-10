<template>
  <Chip class="cursor-move w-fit h-fit">
    <div class="flex flex-row gap-1">
      <div>{{ stock.sku?.label }}</div>
      <Badge :value="stock.quantity" severity="contrast" />
    </div>
  </Chip>
</template>

<script lang="ts" setup>
import type { Stock } from "@/generated/schema";

const { stock } = defineProps<{ stock: Stock }>();
</script>

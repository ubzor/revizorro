<template>
  <Chip class="cursor-move">
    <div class="flex flex-row gap-1">
      <div>{{ sku.label }}</div>
      <Badge value="0" severity="contrast" />
    </div>
  </Chip>
</template>

<script lang="ts" setup>
import type { Sku } from "~/generated/schema";

const { sku } = defineProps<{ sku: Sku }>();
</script>

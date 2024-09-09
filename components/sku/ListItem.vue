<template>
  <div class="w-full">{{ sku.label }}</div>
</template>

<script lang="ts" setup>
import type { Sku } from "~/generated/schema";

const { sku } = defineProps<{ sku: Sku }>();
</script>

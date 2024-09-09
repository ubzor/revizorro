<template>
  <div class="w-64 h-64">
    <Card class="w-full h-full">
      <template #title>{{ storage.label }}</template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import type { Storage } from "~/generated/schema";

const { storage } = defineProps<{ storage: Storage }>();
</script>

<template>
  <div class="flex flex-row flex-wrap gap-2">
    <div class="w-64 h-64">
      <StorageAdd
        v-if="!isAddFormVisible"
        @click.prevent="isAddFormVisible = true"
      />
      <FormCreateStorage v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data } = useListStoragesQuery({ variables: {} });

const isAddFormVisible = ref(false);
</script>

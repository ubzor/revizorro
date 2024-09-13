<template>
  <div v-if="searchQuery && !storages.length" class="w-full">Nothing found</div>
  <div v-else class="flex flex-row flex-wrap gap-2 w-full">
    <StorageListItem
      v-for="storage in storages"
      :storage="storage"
      :key="storage.id"
    />

    <StorageAdd
      v-if="!isAddFormVisible"
      @click.prevent="isAddFormVisible = true"
    />
    <div v-else class="w-[calc((100%-16px)/3)] h-min-64">
      <FormCreateStorage
        @success="onCreateStorageSuccess"
        @cancel="isAddFormVisible = false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Storage } from "@/generated/schema";

const { storages } = defineProps<{ storages: Storage[] }>();

const uiStore = useUIStore();

const { searchQuery } = storeToRefs(uiStore);

const isAddFormVisible = ref(false);

const onCreateStorageSuccess = (_storage: Storage) => {
  isAddFormVisible.value = false;
  uiStore.refetch();
};
</script>

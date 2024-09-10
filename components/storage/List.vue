<template>
  <div class="flex flex-row flex-wrap gap-2 w-full">
    <StorageListItem
      v-for="storage in storages"
      :storage="storage"
      :key="storage.id"
    />

    <div class="w-64 h-64">
      <StorageAdd
        v-if="!isAddFormVisible"
        @click.prevent="isAddFormVisible = true"
      />
      <FormCreateStorage
        v-else
        @success="onCreateStorageSuccess"
        @cancel="isAddFormVisible = false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Storage } from "@/generated/schema";

const { data } = useListStoragesQuery({ variables: {} });

const isAddFormVisible = ref(false);

const storages = computed(() => data?.value?.listStorages ?? []);

const onCreateStorageSuccess = (_storage: Storage) => {
  isAddFormVisible.value = false;
};
</script>

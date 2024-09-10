<template>
  <div class="grow flex flex-row gap-8 items-top justify-items-start">
    <template v-if="isAuthenticated">
      <div class="min-w-96 h-[calc(100vh-112px)]">
        <SkuList />
      </div>
      <div class="grow">
        <StorageList />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
const { isAuthenticated } = useAuth();
</script>

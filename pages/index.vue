<template>
  <div class="grow flex flex-col gap-12 items-top justify-items-start">
    <template v-if="isAuthenticated">
      <!-- <SkuList /> -->
      <StorageList />
    </template>
  </div>
</template>

<script lang="ts" setup>
const { isAuthenticated } = useAuth();
</script>

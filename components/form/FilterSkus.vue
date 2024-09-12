<template>
  <form class="w-full flex flex-row gap-4" @submit.prevent="onSubmit">
    <div class="flex flex-col gap-2 w-full">
      <FloatLabel>
        <InputText
          v-model="searchQuery"
          id="filter-skus__query"
          class="w-full"
          show-buttons
          button-layout="horizontal"
          :min="0"
          :step="1"
        />
        <label for="filter-skus__query">Search Query</label>
      </FloatLabel>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

const { searchQuery } = storeToRefs(useUIStore());

const onSubmit = () => {};
</script>

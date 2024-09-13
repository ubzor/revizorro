<template>
  <div
    class="cursor-move w-fit h-fit p-1 flex flex-row gap-1 items-center bg-neutral-100 rounded-lg"
    style="flex: 0 0 auto"
    :data-draggable-id="dataDraggableId"
  >
    <div class="text-xs h-fit">{{ label }}</div>
    <Badge
      v-if="quantity !== undefined"
      :value="quantity"
      severity="contrast"
      size="small"
    />
  </div>
</template>

<script lang="ts" setup>
// TODO: понять почему не работает компонент Chip из набора PrimeVue

const { label, quantity } = defineProps<{
  label?: string;
  quantity?: string;
  dataDraggableId?: string;
}>();
</script>

<style lang="sass" scoped></style>

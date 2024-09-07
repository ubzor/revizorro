<template>
  <Layout>
    <template #preview>
      <EPreview>Registration confirmation code: {{ code }}</EPreview>
    </template>
    <template #content>
      <EText>Registration confirmation code: {{ code }}</EText>
    </template>
  </Layout>
</template>

<script lang="ts" setup>
const { code } = defineProps<{ code: string }>();
</script>

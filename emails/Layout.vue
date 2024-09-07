<template>
  <EHtml>
    <EHead />
    <slot name="preview" />
    <EBody>
      <ESection>
        <slot name="content" />
      </ESection>
    </EBody>
  </EHtml>
</template>

<script lang="ts" setup></script>

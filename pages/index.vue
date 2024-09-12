<template>
  <div class="grow flex flex-row gap-8 items-top justify-items-start">
    <template v-if="isAuthenticated">
      <div class="min-w-96 h-[calc(100vh-112px)]">
        <SkuList :skus="skusWithQuantities" />
      </div>
      <div class="grow">
        <StorageList :storages="storages" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["is-authenticated"],
});

const { isAuthenticated } = useAuth();

const { data: skusData } = useListSkusQuery({ variables: {} });
const { data: storagesData } = useListStoragesQuery({ variables: {} });

const { searchQuery } = storeToRefs(useUIStore());

const skus = computed(() => {
  if (!searchQuery.value) return skusData?.value?.listSkus ?? [];

  return (
    skusData?.value?.listSkus.filter(({ label }) =>
      label.toLowerCase().includes(searchQuery.value.toLowerCase())
    ) ?? []
  );
});

const storages = computed(() => {
  return (
    storagesData?.value?.listStorages
      .map(({ stocks, ...rest }) => ({
        stocks: stocks.filter(({ sku }) =>
          sku?.label.toLowerCase().includes(searchQuery.value.toLowerCase())
        ),
        ...rest,
      }))
      .filter(({ stocks }) => (searchQuery.value ? stocks.length : true)) ?? []
  );
});

const skusWithQuantities = computed(() =>
  skus.value.map((sku) => ({
    ...sku,
    quantity: storages.value?.reduce(
      (total, { stocks }) =>
        total +
        stocks.reduce(
          (total, { quantity, sku: stockSku }) =>
            total + (sku?.id === stockSku?.id ? quantity : 0),
          0
        ),
      0
    ),
  }))
);
</script>

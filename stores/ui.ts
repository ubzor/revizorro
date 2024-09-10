import { defineStore, acceptHMRUpdate } from "pinia";

import { UIStates } from "@/types/UIStates";

import type { Sku, Storage } from "@/generated/schema";

export const useUIStore = defineStore("ui", {
  state: () => ({
    uiState: undefined as UIStates | undefined,

    sku: undefined as Sku | undefined,
    storage: undefined as Storage | undefined,

    isModalEnterQuantityVisible: false,
  }),

  actions: {
    reset() {
      this.uiState = undefined;
      this.sku = undefined;
      this.storage = undefined;
      this.isModalEnterQuantityVisible = false;
    },
  },

  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStore, import.meta.hot));
}

import { defineStore, acceptHMRUpdate } from "pinia";

import { UIStates } from "@/types/UIStates";

export const useUIStore = defineStore("ui", {
  state: () => ({
    uiState: undefined as UIStates | undefined,

    isModalEnterQuantityVisible: false,
  }),

  actions: {
    reset() {
      this.uiState = undefined;
      this.isModalEnterQuantityVisible = false;
    },
  },

  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStore, import.meta.hot));
}

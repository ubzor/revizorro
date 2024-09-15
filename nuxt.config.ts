// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from "@primevue/themes/aura";

import path from "node:path";
// import graphqlLoader from "vite-plugin-graphql-loader";

export default defineNuxtConfig({
  modules: [
    "nuxt-scheduler",
    "nuxt-graphql-codegen",
    "@pinia/nuxt",
    "@vue-email/nuxt",
    "@vueuse/nuxt",
    "@vueuse/motion/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "@primevue/nuxt-module",
  ],
  devtools: { enabled: true },
  // vite: {
  //   plugins: [graphqlLoader()],
  // },
  css: [],
  vueEmail: {
    baseUrl: "http://localhost:3000/",
    autoImport: true,
  },
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          cssLayer:
            "reset, tailwind-base, tailwind-components, primevue, tailwind-utilities, tailwind-variants",
        },
      },
    },
    components: {
      prefix: "",
      include: [
        "Avatar",
        "Badge",
        "Button",
        "Checkbox",
        "Card",
        "Chip",
        "Dialog",
        "FloatLabel",
        "IconField",
        "InputIcon",
        "InputNumber",
        "InputOtp",
        "InputText",
        "Menubar",
        "Password",
        "Toast",
      ],
    },
  },
});

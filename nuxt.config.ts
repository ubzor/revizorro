// https://nuxt.com/docs/api/configuration/nuxt-config

import path from "node:path";
// import graphqlLoader from "vite-plugin-graphql-loader";

export default defineNuxtConfig({
  modules: [
    "nuxt-scheduler",
    "nuxt-graphql-codegen",
    "@vue-email/nuxt",
    "@vueuse/nuxt",
    "@vueuse/motion/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "nuxt-primevue",
  ],
  devtools: { enabled: true },
  // vite: {
  //   plugins: [graphqlLoader()],
  // },
  css: ["primevue/resources/themes/aura-light-green/theme.css"],
  vueEmail: {
    baseUrl: "http://localhost:3000/",
    autoImport: true,
  },
  primevue: {
    options: {
      ripple: true,
    },
    components: {
      prefix: "",
      include: [
        "Avatar",
        "Button",
        "Checkbox",
        "Card",
        "FloatLabel",
        "IconField",
        "InputIcon",
        "InputOtp",
        "InputText",
        "Menubar",
        "Password",
        "Toast",
      ],
    },
    cssLayerOrder:
      "reset, tailwind-base, tailwind-components, primevue, tailwind-utilities, tailwind-variants",
  },
});

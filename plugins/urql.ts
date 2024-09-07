import urql, { cacheExchange, fetchExchange } from "@urql/vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(urql as any, {
    url: "http://localhost:3000/api/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });
});

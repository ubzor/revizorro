export default defineNuxtRouteMiddleware(async () => {
  const { user } = useAuth();

  // TODO: исправить ворнинг в консоли
  // [nuxt] [useFetch] Component is already mounted, please use $fetch instead. See https://nuxt.com/docs/getting-started/data-fetching

  const { data } = await useFetch("/api/auth/user");
  if (data.value) {
    user.value = data.value;
  }
});

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated.value) {
    return navigateTo(`/auth/login?redirect_to=${to.fullPath}`);
  }
});

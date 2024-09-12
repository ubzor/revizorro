<template>
  <div
    :style="{
      backgroundColor: 'var(--surface-0)',
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    }"
  >
    <div>
      <Menubar>
        <template #start>
          <Button label="Auth App" text @click="navigateTo('/')">
            <template #icon>
              <Icon
                class="p-button-icon p-button-icon-left"
                name="lets-icons:sign-in"
                size="24"
              />
            </template>
          </Button>
        </template>

        <template #end>
          <div class="flex items-center gap-2">
            <template v-if="isAuthenticated">
              <NuxtLink to="/" class="flex items-center gap-2">
                <Avatar
                  label="F"
                  style="background-color: #dee9fc; color: #1a2551"
                  shape="circle"
                />
                <div>{{ user?.email }}</div>
              </NuxtLink>
              <Button label="Log out" severity="secondary" @click="logout" />
            </template>
            <template v-else>
              <Button label="Sign In" @click="navigateTo('/auth/login')" />
              <Button
                label="Sign Up"
                severity="secondary"
                @click="navigateTo('/auth/register')"
              />
            </template>
          </div>
        </template>
      </Menubar>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { user, isAuthenticated } = useAuth();

const logout = async () => {
  if (isAuthenticated.value) {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });
  }

  user.value = null;

  await navigateTo("/auth/login");
};
</script>

<style lang="sass" scoped>
.p-menubar
    @apply border-none bg-transparent
</style>

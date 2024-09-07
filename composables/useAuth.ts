import type { User } from "lucia";

export const useAuth = () => {
  const user = useState<User | null>("user", () => null);

  const isAuthenticated = computed(() => !!user.value);

  return { user, isAuthenticated };
};

export const authScopes = async (context: Context) => ({
  isNotLoggedIn: !context.session?.userId,
  isLoggedIn: !!context.session?.userId,
});

export type AuthScopes = Awaited<ReturnType<typeof authScopes>>;

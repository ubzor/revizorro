import { type H3Event } from "h3";

export const getContext = (event: H3Event) => ({
  prisma,
  session: event.context.session,
});

export type Context = ReturnType<typeof getContext>;

import { ZodError } from "zod";

import { builder } from "../utils/builder";
import { emailValidationSchema } from "../utils/validation";

export const setUserSchema = () => {
  builder.prismaObject("User", {
    fields: (t) => ({ id: t.exposeID("id") }),
  });

  builder.queryFields((t) => ({
    emailIsAvailable: t.boolean({
      args: {
        email: t.arg.string({
          required: true,
          validate: {
            schema: emailValidationSchema,
          },
        }),
      },
      resolve: async (query, { email }) =>
        (await prisma.user.count({ ...query, where: { email } })) === 0,
      errors: {
        types: [ZodError],
      },
    }),

    lastRegistrationConfirmationCodeSentAt: t.field({
      type: "Date",
      args: {
        email: t.arg.string({
          required: true,
          validate: {
            schema: emailValidationSchema,
          },
        }),
      },
      nullable: true,
      resolve: async (query, { email }) =>
        (
          await prisma.confirmationCode.findFirst({
            ...query,
            where: { user: { email }, type: { slug: "registration" } },
            orderBy: { expiresAt: "desc" },
          })
        )?.createdAt ?? null, // TODO: понять как возвращать null
      errors: {
        types: [ZodError],
      },
    }),
  }));

  // TODO: удалить после того как появятся настоящие мутации
  builder.mutationFields((t) => ({
    registerNewUser: t.prismaField({
      type: "User",
      nullable: true,
      args: {
        email: t.arg.string({
          required: true,
          validate: {
            schema: emailValidationSchema,
          },
        }),
        password: t.arg.string({
          required: true,
          // TODO: password validation
        }),
      },
      resolve: (_, __, { email, password }) => {
        return null;
      },
      errors: {
        types: [ZodError],
      },
    }),
  }));
};

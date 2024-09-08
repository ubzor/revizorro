import { ZodError } from "zod";

import { builder } from "../utils/builder";
import { createStorageValidationSchema } from "../utils/validation";

export const setStorageSchema = () => {
  builder.prismaObject("Storage", {
    fields: (t) => ({
      id: t.exposeID("id"),
      label: t.exposeString("label"),
    }),
  });

  builder.mutationFields((t) => ({
    createSKU: t.prismaField({
      type: "Storage",
      nullable: false,
      args: {
        label: t.arg.string({
          required: true,
        }),
      },
      validate: {
        schema: createStorageValidationSchema,
      },
      resolve: async (_, __, { label }) => {
        return await prisma.storage.create({ data: { label } });
      },
    }),
  }));
};

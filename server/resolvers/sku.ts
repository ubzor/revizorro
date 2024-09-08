import { ZodError } from "zod";

import { builder } from "../utils/builder";
import { createSkuValidationSchema } from "../utils/validation";

export const setSkuSchema = () => {
  builder.prismaObject("Sku", {
    fields: (t) => ({
      id: t.exposeID("id"),
      label: t.exposeString("label"),
    }),
  });

  builder.mutationFields((t) => ({
    createSku: t.prismaField({
      type: "Sku",
      nullable: false,
      args: {
        label: t.arg.string({
          required: true,
        }),
      },
      validate: {
        schema: createSkuValidationSchema,
      },
      resolve: async (_, __, { label }) => {
        return await prisma.sku.create({ data: { label } });
      },
    }),
  }));
};

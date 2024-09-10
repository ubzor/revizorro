import { ZodError } from "zod";

import { builder } from "../utils/builder";
import { createStorageValidationSchema } from "../utils/validation";

export const setStorageSchema = () => {
  builder.prismaObject("Storage", {
    fields: (t) => ({
      id: t.exposeID("id"),
      label: t.exposeString("label"),

      stocks: t.prismaField({
        type: ["Stock"],
        nullable: false,
        resolve: async (query, { id }) =>
          await prisma.stock.findMany({ ...query, where: { storageId: id } }),
      }),
    }),
  });

  builder.queryFields((t) => ({
    listStorages: t.prismaField({
      type: ["Storage"],
      nullable: false,
      resolve: async () => await prisma.storage.findMany(),
    }),
  }));

  builder.mutationFields((t) => ({
    createStorage: t.prismaField({
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
      errors: {
        types: [ZodError],
      },
    }),
  }));
};

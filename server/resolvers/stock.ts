import { ZodError } from "zod";

import { builder } from "../utils/builder";
import {
  addStockValidationSchema,
  removeStockValidationSchema,
  moveStockValidationSchema,
} from "../utils/validation";

export const setStockSchema = () => {
  builder.prismaObject("Stock", {
    fields: (t) => ({
      id: t.exposeID("id"),
      skuId: t.exposeID("skuId"),
      storageId: t.exposeID("storageId"),
      quantity: t.exposeInt("quantity"),

      sku: t.prismaField({
        type: "Sku",
        nullable: true,
        resolve: async (_, { skuId }) =>
          await prisma.sku.findUnique({ where: { id: skuId } }),
      }),

      storage: t.prismaField({
        type: "Storage",
        nullable: true,
        resolve: async (_, { storageId }) =>
          await prisma.storage.findUnique({ where: { id: storageId } }),
      }),
    }),
  });

  builder.mutationFields((t) => ({
    addStock: t.prismaField({
      type: "Stock",
      nullable: false,
      args: {
        skuId: t.arg.string({ required: true }),
        storageId: t.arg.string({ required: true }),
        quantity: t.arg.int({ required: true }),
      },
      validate: { schema: addStockValidationSchema },
      resolve: async (_, __, { skuId, storageId, quantity }) => {
        const existingStosk = await prisma.stock.findFirst({
          where: { skuId, storageId },
        });

        if (existingStosk) {
          await prisma.stock.update({
            where: { id: existingStosk.id },
            data: { quantity: existingStosk.quantity + quantity },
          });

          return existingStosk;
        }

        return await prisma.stock.create({
          data: { skuId, storageId, quantity },
        });
      },
      errors: {
        types: [ZodError],
      },
    }),

    moveStock: t.prismaField({
      type: "Stock",
      nullable: false,
      args: {
        id: t.arg.string({ required: true }),
        toStorageId: t.arg.string({ required: true }),
        quantity: t.arg.int({ required: true }),
      },
      validate: { schema: moveStockValidationSchema },
      resolve: async (_, __, { id, toStorageId, quantity }) => {
        const fromStock = await prisma.stock.findUnique({
          where: { id },
        });

        // TODO: validate in zod schema

        if (!fromStock) {
          throw new Error("Stock not found");
        }

        if (fromStock.quantity < quantity) {
          throw new Error("Not enough quantity");
        }

        await prisma.stock.update({
          where: { id: fromStock.id },
          data: { quantity: fromStock.quantity - quantity },
        });

        const existingToStock = await prisma.stock.findFirst({
          where: { skuId: fromStock.skuId, storageId: toStorageId },
        });

        if (existingToStock) {
          return await prisma.stock.update({
            where: { id: existingToStock.id },
            data: { quantity: existingToStock.quantity + quantity },
          });
        }

        return await prisma.stock.create({
          data: { skuId: fromStock.skuId, storageId: toStorageId, quantity },
        });
      },
      errors: {
        types: [Error, ZodError],
      },
    }),

    removeStock: t.field({
      type: "Boolean",
      nullable: false,
      args: {
        id: t.arg.string({ required: true }),
        quantity: t.arg.int({ required: true }),
      },
      validate: { schema: removeStockValidationSchema },
      resolve: async (_, { id, quantity }) => {
        const stock = await prisma.stock.findUnique({ where: { id } });

        // TODO: validate in zod schema

        if (!stock) {
          throw new Error("Stock not found");
        }

        if (stock.quantity < quantity) {
          throw new Error("Not enough quantity");
        }

        if (stock.quantity > quantity) {
          await prisma.stock.update({
            where: { id },
            data: { quantity: stock.quantity - quantity },
          });

          return true;
        }

        await prisma.stock.delete({ where: { id } });

        return true;
      },
      errors: {
        types: [Error, ZodError],
      },
    }),
  }));
};

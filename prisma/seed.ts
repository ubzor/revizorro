import { PrismaClient } from "@prisma/client";
import { Argon2id } from "oslo/password";

import { users } from "@/prisma/users.json";
import { OperationTypes } from "@/types/OperationTypes";

const prisma = new PrismaClient();

const seedConfirmationCodeTypes = async () => {
  await prisma.confirmationCodeType.upsert({
    where: { slug: "registration" },
    update: {},
    create: {
      slug: "registration",
    },
  });
};

const seedUsers = async () => {
  await Promise.all(
    users.map(async ({ email, password }) => {
      await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          hashedPassword: await new Argon2id().hash(password),
          registrationConfirmed: true,
        },
      });
    })
  );
};

const seedOperationTypes = async () => {
  await Promise.all(
    Object.values(OperationTypes).map(async (slug) => {
      await prisma.operationType.upsert({
        where: { slug },
        update: {},
        create: {
          slug,
        },
      });
    })
  );
};

(async () => {
  try {
    await seedConfirmationCodeTypes();
    await seedUsers();
    seedOperationTypes();
  } catch (error: any) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();

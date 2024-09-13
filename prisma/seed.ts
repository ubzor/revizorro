import { PrismaClient } from "@prisma/client";
import { Argon2id } from "oslo/password";

import { users } from "@/prisma/users.json";

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
  await prisma.user.createMany({
    data: await Promise.all(
      users.map(async ({ email, password }) => ({
        email,
        hashedPassword: await new Argon2id().hash(password),
        registrationConfirmed: true,
      }))
    ),
  });
};

(async () => {
  try {
    await seedConfirmationCodeTypes();
    await seedUsers();
  } catch (error: any) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();

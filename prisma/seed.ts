import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedConfirmationCodeTypes = async () => {
  const registration = await prisma.confirmationCodeType.upsert({
    where: { slug: "registration" },
    update: {},
    create: {
      slug: "registration",
    },
  });

  console.log(registration);
};

(async () => {
  try {
    await seedConfirmationCodeTypes();
  } catch (error: any) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();

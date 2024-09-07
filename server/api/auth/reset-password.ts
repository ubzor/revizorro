import { Prisma } from "@prisma/client";

export default eventHandler(async (event) => {
  const { email } = validateObject<typeof resetPasswordFormValidationSchema>(
    resetPasswordFormValidationSchema,
    await readBody(event)
  );

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw createError({
        message: "No users found with this email",
        statusCode: 400,
        data: {
          fieldErrors: [
            {
              path: "email",
              message: "No users found with this email",
            },
          ],
        },
      });
    }

    // TODO: reset password logic
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw createError({
        message: error.message,
        statusCode: 500,
      });
    }

    throw error;
  }
});

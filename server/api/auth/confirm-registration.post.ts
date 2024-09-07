import { Prisma } from "@prisma/client";

export default eventHandler(async (event) => {
  const { email, code } = validateObject<
    typeof confirmRegistrationFormValidationSchema
  >(confirmRegistrationFormValidationSchema, await readBody(event));

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw createError(
        validationError([
          {
            path: "email",
            message: "No users found with this email",
          },
        ])
      );
    }

    if (user.registrationConfirmed) {
      throw createError(
        validationError([
          {
            path: "email",
            message: "Registration already confirmed",
          },
        ])
      );
    }

    const registrationConfirmationCode =
      await prisma.confirmationCode.findFirst({
        where: { type: { slug: "registration" }, user: { email }, code },
        include: { user: true },
      });

    if (!registrationConfirmationCode) {
      throw createError(
        validationError([
          {
            path: "code",
            message: "Incorrect confirmation code",
          },
        ])
      );
    }

    if (registrationConfirmationCode.expiresAt < new Date(Date.now())) {
      throw createError(
        validationError([
          {
            path: "code",
            message: "Confirmation code expired",
          },
        ])
      );
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: { registrationConfirmed: true },
    });

    await prisma.confirmationCode.deleteMany({
      where: { userId: user.id, type: { slug: "registration" } },
    });

    // TODO: send email

    const session = await lucia.createSession(user.id, {});
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
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

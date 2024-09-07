import { Prisma } from "@prisma/client";

import { useMail } from "@/composables/useMail";

export default eventHandler(async (event) => {
  const { sendMail } = useMail();

  const { email } = validateObject<
    typeof sendRegistrationConfirmationCodeFormValidationSchema
  >(
    sendRegistrationConfirmationCodeFormValidationSchema,
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

    if (user.registrationConfirmed) {
      throw createError({
        message: "Registration already confirmed",
        statusCode: 400,
        data: {
          fieldErrors: [
            {
              path: "email",
              message: "Registration already confirmed",
            },
          ],
        },
      });
    }

    const { id: registrationTypeId } =
      await prisma.confirmationCodeType.findUniqueOrThrow({
        where: { slug: "registration" },
      });

    const lastMinuteRegistrationConfirmationCodes =
      await prisma.confirmationCode.findMany({
        where: {
          userId: user.id,
          typeId: registrationTypeId,
          createdAt: { gte: new Date(Date.now() - 1000 * 60 * 1) }, // 1 minute
        },
      });

    if (lastMinuteRegistrationConfirmationCodes.length) {
      throw createError({
        message: "Code already sent less then a minute ago",
        statusCode: 400,
        data: {
          fieldErrors: [
            {
              path: "code",
              message: "Code already sent less then a minute ago",
            },
          ],
        },
      });
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase(); // TODO: better code generation

    const registrationConfirmationCode = await prisma.confirmationCode.create({
      data: {
        userId: user.id,
        typeId: registrationTypeId,
        code,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
      },
    });

    sendMail({
      to: email,
      subject: "Confirm registration",
      template: "ConfirmRegistration",
      options: {
        props: {
          code,
        },
      },
    });
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

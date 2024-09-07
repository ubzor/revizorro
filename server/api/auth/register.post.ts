import { Argon2id } from "oslo/password";
import { Prisma } from "@prisma/client";

import { useMail } from "@/composables/useMail";

export default eventHandler(async (event) => {
  const { sendMail } = useMail();

  const { email, password, isAgreed } = validateObject<
    typeof registerFormValidationSchema
  >(registerFormValidationSchema, await readBody(event));

  // We recommend using Argon2id, but Oslo also provides Scrypt and Bcrypt. These only work in Node.js.
  // If you're planning to deploy your project to a non-Node.js runtime, use Scrypt provided by lucia.
  // https://lucia-auth.com/tutorials/username-and-password/nuxt
  const hashedPassword = await new Argon2id().hash(password);

  try {
    if (await prisma.user.count({ where: { email } })) {
      throw createError({
        message: "This email is already used",
        statusCode: 400,
        data: {
          fieldErrors: [
            {
              path: "email",
              message: "This email is already used",
            },
          ],
        },
      });
    }

    const user = await prisma.user.create({
      data: { email, hashedPassword },
    });

    // TODO: send email
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

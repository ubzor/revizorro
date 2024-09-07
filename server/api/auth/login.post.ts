import { Argon2id } from "oslo/password";

export default eventHandler(async (event) => {
  const { email, password } = validateObject<typeof loginFormValidationSchema>(
    loginFormValidationSchema,
    await readBody(event)
  );

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is none-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    throw createError({
      message: "Incorrect username or password",
      statusCode: 400,
      data: {
        fieldErrors: [
          {
            path: "email",
            message: "Incorrect username or password",
          },
        ],
      },
    });
  }

  const isPasswordValid = await new Argon2id().verify(
    user.hashedPassword,
    password
  );

  if (!isPasswordValid) {
    throw createError({
      message: "Incorrect username or password",
      statusCode: 400,
      data: {
        fieldErrors: [
          {
            path: "email",
            message: "Incorrect username or password",
          },
        ],
      },
    });
  }

  if (!user.registrationConfirmed) {
    throw createError({
      message: "Registration not confirmed",
      statusCode: 400,
      data: {
        fieldErrors: [
          {
            path: "registrationConfirmed",
            message: "Registration not confirmed",
          },
        ],
      },
    });
  }

  const session = await lucia.createSession(user.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize()
  );
});

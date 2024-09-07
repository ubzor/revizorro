import { z } from "zod";

export const validationError = (
  fieldErrors: { path: string; message: string }[]
) => ({
  message: fieldErrors.length ? fieldErrors[0].message : "Something went wrong",
  statusCode: 400,
  data: {
    fieldErrors,
  },
});

export const emailValidationSchema = z.string().email("Invalid email address");

// TODO: strong password validation
export const passwordValidationSchema = z
  .string()
  .min(6, "Password is too short")
  .max(255, "Password is too long");

export const codeValidationSchema = z
  .string()
  .length(6, "Code must be 6 symbols long");

export const registerFormValidationSchema = z
  .object({
    email: emailValidationSchema,
    password: passwordValidationSchema,
    repeatPassword: passwordValidationSchema,
    isAgreed: z.literal(true),
  })
  .refine(({ password, repeatPassword }) => password === repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export const checkRegistrationConfirmationSchema = z.object({
  email: emailValidationSchema,
});

export const sendRegistrationConfirmationCodeFormValidationSchema = z.object({
  email: emailValidationSchema,
});

export const confirmRegistrationFormValidationSchema = z.object({
  email: emailValidationSchema,
  code: codeValidationSchema,
});

export const loginFormValidationSchema = z.object({
  email: emailValidationSchema,
  password: passwordValidationSchema,
});

export const resetPasswordFormValidationSchema = z.object({
  email: emailValidationSchema,
});

import { createSharedComposable } from "@vueuse/core";
import nodemailer from "nodemailer";
import { useCompiler } from "#vue-email";

import type { RenderOptions } from "@vue-email/compiler";

export const useMail = createSharedComposable(() => ({
  sendMail: async ({
    to,
    subject,
    template,
    options,
    verbose,
  }: {
    to: string;
    subject: string;
    template: string;
    options?: RenderOptions;
    verbose?: boolean;
  }) => {
    const { html, text } = await useCompiler(
      `${template}.vue`,
      options,
      verbose
    );

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: +(process.env.MAIL_PORT ?? 465),
      secure: !!process.env.MAIL_SECURE,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    return await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: "forubz@gmail.com", // TODO: change to the user's email after tests
      subject,
      html,
    });
  },
}));

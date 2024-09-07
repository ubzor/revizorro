import { z } from "zod";
import { zu } from "zod_utilz";

export * from "../../utils/validation";

export const validateFormData = <T extends z.AnyZodObject>(
  schema: T,
  formData: FormData
) => {
  const formDataObject = Object.fromEntries(formData.entries());
  return validateObject(schema, formDataObject);
};

export const validateObject = <T extends z.AnyZodObject>(
  schema: T,
  object: object
) => {
  const { data, error } = zu.SPR(schema.safeParse(object));

  if (!data || error?.flatten().fieldErrors) {
    // TODO: отдавать на фронт ошибки для всех полей

    throw createError({
      message: Object.values(error!.flatten().fieldErrors)[0]![0],
      statusCode: 400,
    });
  }

  return data as z.infer<T>;
};

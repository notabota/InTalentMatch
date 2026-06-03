import { z } from "zod";

export const emailSchema = z.string().email().min(3).max(256);
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters long.");

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().min(1).max(256).optional(),
  sendConfirmation: z.string().optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
  isPersistent: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: passwordSchema,
});

export const cardSchema = z.object({
  number: z.string().regex(/^[0-9 -]{13,19}$/, "Invalid card number."),
  expiry: z.string().regex(/^(0\d|1[0-2])\/\d\d$/, "Invalid expiry."),
  cvv: z.string().regex(/^\d{3}$/, "Invalid CVV."),
  name: z.string().min(1).max(128),
});

export const reviewSchema = z.object({
  requestId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  description: z.string().max(2000).optional(),
});

export function parseForm<T extends z.ZodTypeAny>(
  schema: T,
  params: URLSearchParams,
): z.infer<T> {
  const obj: Record<string, string | string[]> = {};
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    obj[key] = values.length > 1 ? values : values[0];
  }
  return schema.parse(obj);
}

export function safeParseForm<T extends z.ZodTypeAny>(
  schema: T,
  params: URLSearchParams,
):
  | { ok: true; data: z.infer<T> }
  | { ok: false; error: string } {
  try {
    return { ok: true, data: parseForm(schema, params) };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const first = err.issues[0];
      return { ok: false, error: first?.message ?? "Invalid input." };
    }
    return { ok: false, error: "Invalid input." };
  }
}

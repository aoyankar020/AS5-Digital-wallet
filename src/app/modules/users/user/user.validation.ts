import * as z from "zod";

// Import or define EISACTIVE enum

export const userValidationSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must include uppercase letter")
    .regex(/[a-z]/, "Must include lowercase letter")
    .regex(/\d/, "Must include a number"),

  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),

  address: z
    .string()
    .min(200, "Minimum length would be 200 character")
    .optional(),
  image: z.string().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must include uppercase letter")
    .regex(/[a-z]/, "Must include lowercase letter")
    .regex(/\d/, "Must include a number"),

  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),

  address: z
    .string()
    .min(200, "Minimum length would be 200 character")
    .optional(),
  image: z.string().optional(),
});

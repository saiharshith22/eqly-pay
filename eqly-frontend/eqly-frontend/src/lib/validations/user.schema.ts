import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),

  email: z.email(),

  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .optional()
    .or(z.literal("")),

  upiId: z
    .string()
    .regex(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/,
      "Invalid UPI ID format (e.g., name@bank)",
    )
    .optional()
    .or(z.literal("")),
});

export type RegisterUserFormData = z.infer<typeof registerUserSchema>;

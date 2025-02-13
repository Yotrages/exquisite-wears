import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "The field is required" })
    .email("Please enter a valid email"),
  password: z
    .string({
      required_error: "The password field is required",
    })
    .min(10, "The password must be up to 10 characters"),
  name: z
    .string({ required_error: "The name field is required" })
    .min(5, "Username must be up to 5 characters"),
});
import { z } from "zod";

export const contactSchema = z.object({
  email: z
    .string({ required_error: "The field is required" })
    .email("Please enter a valid email"),
  subject: z
    .string({
      required_error: "The subject field is required",
    })
    .min(10, "The Subject field must be up to 10 characters"),
  name: z
    .string({ required_error: "The name field is required" })
    .min(5, "Username must be up to 5 characters"),
    message: z.string({ required_error: "The message field is required" }).min(10, 'The message field must be up to 10 characters')
});
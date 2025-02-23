import { z } from "zod";

export const loginSchema = z.object({
    email: z
      .string({ required_error: "The field is required" })
      .email("Please enter a valid email"),
    password: z
      .string({
        required_error: "The password field is required",
      })
      .min(5, "The password must be up to 10 characters"),
  });

  export type LoginForm = z.infer<typeof loginSchema>;

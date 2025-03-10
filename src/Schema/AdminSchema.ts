import { z } from "zod";

export const productSchema = z.object({
   image: z.any().refine((file) => file instanceof File || typeof file === "object", {
    message: "Image field must be a valid file",
  }),
  name: z
    .string({ required_error: "Name field is required" })
    .min(10, "The name field should be at least 10 characters"),
  price: z
    .string({
      required_error: "Price field is required",
      invalid_type_error: "The price must be a number",
    })
    .min(2, "The price field should be at least a number"),
  quantity: z
    .number({
      required_error: "Quantity field is required",
      invalid_type_error: "quantity field must be a number",
    })
    .min(1, "The quantity field should have at least a number") 
   .int("Quantity must be an integer")
    .positive("Quantity must be a positive integer"),
    description: z.string({required_error: 'The description field is required'}).min(5, 'Enter at least 5 characters')
});

export type postProduct = z.infer<typeof productSchema>;

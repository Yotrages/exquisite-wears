import { z } from "zod";

export const productSchema = z.object({
  image: z.any().optional().refine((file) => !file || file instanceof File || typeof file === "object", {
    message: "Image field must be a valid file",
  }),
  name: z
    .string({ required_error: "Name field is required" })
    .min(3, "The name field should be at least 3 characters"),
  originalPrice: z
    .number({ invalid_type_error: "Original price must be a number" })
    .optional(),
  price: z
    .number({
      required_error: "Price field is required",
      invalid_type_error: "The price must be a number",
    }).positive('price must be a positive number')
    .min(0.01, "The price field should be at least 0.01"),
  discount: z
    .number({ invalid_type_error: "Discount must be a number" })
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot be more than 100')
    .optional(),
  quantity: z
    .number({
      required_error: "Quantity field is required",
      invalid_type_error: "quantity field must be a number",
    })
    .min(0, "The quantity field should be at least 0") 
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be non-negative"),
  inStock: z.boolean().optional(),
  description: z
    .string({required_error: 'The description field is required'})
    .min(10, 'Description should be at least 10 characters'),
  category: z
    .string({required_error: 'Category field is required'})
    .min(2, 'Category should be at least 2 characters'),
  sku: z
    .string()
    .min(2, 'SKU should be at least 2 characters')
    .optional()
    .or(z.literal('')),
  tags: z
    .array(z.string())
    .optional(),
  brand: z.string().optional(),
  specifications: z.any().optional(),
  seller: z.object({
    name: z.string().optional(),
    rating: z.number().optional()
  }).optional()
});

export type postProduct = z.infer<typeof productSchema>;

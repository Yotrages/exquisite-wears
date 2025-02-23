import { z } from "zod";

export const SubSchema = z.object({
    email: z.string({required_error: 'Email is required'}).email('Must be an email address')
})

export type SubscribeForm = z.infer<typeof SubSchema>

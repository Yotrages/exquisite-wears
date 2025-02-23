import { z } from "zod";

export const NotificationSchema = z.object({
    message: z.string({required_error: 'message field is required'}).min(10),
    subject: z.string({required_error: 'subject field is required'}).min(3)
})

export type Notifications = z.infer<typeof NotificationSchema>
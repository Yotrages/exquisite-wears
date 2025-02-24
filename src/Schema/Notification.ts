import { z } from "zod";

export const NotificationSchema = z.object({
    subject: z.string({required_error: 'subject field is required'}),
    message: z.string({required_error: 'message field is required'}).min(10)
})

export type Notifications = z.infer<typeof NotificationSchema>
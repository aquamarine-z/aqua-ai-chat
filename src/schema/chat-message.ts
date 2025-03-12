import {z} from "zod";

export const ChatMessageContentSchema = z.string().or(z.any())
export const ChatMessageSchema = z.object({
    contents: z.array(ChatMessageContentSchema),
    role: z.enum(["user", "assistant", "system"])
})
export type ChatMessageContent = z.infer<typeof ChatMessageContentSchema>
export type ChatMessage = z.infer<typeof ChatMessageSchema>
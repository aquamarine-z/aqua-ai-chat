import {z} from "zod";

export const ChatMessageContentSchema = z.string().or(z.any())
export const ChatMessageSchema = z.object({
    contents: z.array(ChatMessageContentSchema),
    role: z.enum(["user", "assistant", "system"]),
    streaming: z.boolean(),
    
})
export type ChatMessageContent = z.infer<typeof ChatMessageContentSchema>
export type ChatMessage = z.infer<typeof ChatMessageSchema>
export const defaultUserMessage: ChatMessage = {
    contents: [""],
    role: "user",
    streaming: false
}
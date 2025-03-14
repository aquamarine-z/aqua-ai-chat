import {z} from "zod";
import {ThinkingSchema} from "@/schema/chat-message-metadata/thinking";

export const ChatMessageContentSchema = z.string().or(z.any())
export const ChatMessageSchema = z.object({
    contents: z.array(ChatMessageContentSchema),
    role: z.enum(["user", "assistant", "system"]),
    streaming: z.boolean(),
    thinking: ThinkingSchema.nullable().optional(),
})
export type ChatMessageContent = z.infer<typeof ChatMessageContentSchema>
export type ChatMessage = z.infer<typeof ChatMessageSchema>
export const defaultUserMessage: ChatMessage = {
    contents: [""],
    role: "user",
    streaming: false
}
import {z} from "zod"


export const ChatMessageContentSchema = z.string().or(z.any())
export const ChatMessageSchema = z.object({
    contents: z.array(ChatMessageContentSchema),
    role: z.enum(["user", "assistant", "system"])
})
export const ChatSessionSchema = z.object({
    messages:z.array(ChatMessageContentSchema),
    modelConfig:z.object({
        name:z.string()
    })
})
export const ChatStoreSchema = z.object({
    currentSessionIndex:z.number(),
    sessions:z.array(ChatSessionSchema)
})
export type ChatMessageContent = z.infer<typeof ChatMessageContentSchema>
export type ChatMessage = z.infer<typeof ChatMessageSchema>
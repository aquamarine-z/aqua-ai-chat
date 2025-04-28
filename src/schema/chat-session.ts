import {z} from "zod";
import {ChatMessageContentSchema, defaultGreetingMessage} from "@/schema/chat-message";
import {defaultModelConfig, ModelConfigSchema} from "@/schema/model-config";

export const ChatSessionSchema = z.object({
    messages: z.array(ChatMessageContentSchema),
    modelConfig: ModelConfigSchema,
    name: z.string(),
    streaming: z.boolean().nullable().optional(),
})
export type ChatSession = z.infer<typeof ChatSessionSchema>
export const defaultChatSession: ChatSession = {
    messages: [defaultGreetingMessage],
    modelConfig: defaultModelConfig,
    name: "New Conversation",
    streaming: false,
}
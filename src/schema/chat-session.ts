import {z} from "zod";
import {ChatMessageContentSchema, defaultGreetingMessage} from "@/schema/chat-message";
import {defaultModelConfig, ModelConfigSchema} from "@/schema/model-config";
import {defaultInputStorage, InputStorageSchema} from "@/schema/input-storage";


export const ChatSessionSchema = z.object({
    messages: z.array(ChatMessageContentSchema),
    modelConfig: ModelConfigSchema,
    name: z.string(),
    streaming: z.boolean().nullable().optional(),
    inputStorage: InputStorageSchema,
    id: z.number().optional(),
})
export type ChatSession = z.infer<typeof ChatSessionSchema>
export const defaultChatSession: ChatSession = {
    messages: [],
    modelConfig: defaultModelConfig,
    name: "New Conversation",
    streaming: false,
    inputStorage: defaultInputStorage,

}

export function createNewChatSession(): ChatSession {
    return {
        ...defaultChatSession,
        id: Math.floor(Math.random() * 1000000), // Generate a random ID for the new session
    }
}